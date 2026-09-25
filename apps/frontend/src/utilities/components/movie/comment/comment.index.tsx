import { ArrowDown2 } from "iconsax-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Spinner } from "../../ui";
import CommentCardComp from "./commentCard/commentCard.index";
import CommentInputComp from "./commentInput/commentInput.index";
import CommentEntityPickerComp from "./commentEntityPicker/commentEntityPicker.index";
import CommentEmptyStateComp from "./emptyState/emptyState.index";
import { useLocale } from "../../../../hooks";
import { ClientCall } from "../../../../scripts/client";
import { CommentEntityTypeEnum, CommentType, MovieTypeEnum, PaginationType, SortTypeEnum } from "../../../../types";
import { AppApis } from "../../../../data";
import { CommentSectionCompProps } from "./comment.type";

function CommentSectionComp({ entitySlug, entityId, entityType, movieTitle, movie }: CommentSectionCompProps) {
  const { locale } = useLocale();
  const [commentEntityType, setCommentEntityType] = useState({
    entityId,
    entityType,
    entitySlug,
  });

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", commentEntityType.entityType, commentEntityType.entitySlug, locale],
    queryFn: ({ pageParam = 1 }) =>
      ClientCall<PaginationType<CommentType>>(AppApis.comment.index(commentEntityType.entitySlug), {
        method: "GET",
        locale,
        query: {
          page: pageParam,
          page_size: 10,
          sort: SortTypeEnum.ASC,
          entity_type: commentEntityType.entityType,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const loadedCount = allPages.reduce((sum, page: any) => sum + (page.data?.length ?? 0), 0);
      return loadedCount < lastPage.count ? lastPage.page + 1 : undefined;
    },
  });

  const isSeriesMovieEntity = movie?.type === MovieTypeEnum.SERIES && entityType === CommentEntityTypeEnum.MOVIE && ((movie.seasons_count ?? 1) > 1 || (movie.episodes_count ?? 1) > 1);
  const totalCount = comments?.pages?.[0]?.count ?? 0;

  const flatComments = comments?.pages.flatMap((page) => page.data ?? []) ?? [];

  return (
    <section className="w-full px-layout-x-space max-w-layout-max mx-auto flex flex-col gap-4 lg:gap-8">
      <h5 className="text-white text-mobile-h-5 lg:text-h-5">دیدگاه ها</h5>

      <div className="flex flex-col gap-3">
        {isSeriesMovieEntity ? <CommentEntityPickerComp movieSlug={entitySlug} movieId={entityId} movieTitle={movieTitle} commentEntityType={commentEntityType} setCommentEntityType={setCommentEntityType} /> : null}
        <CommentInputComp entityId={commentEntityType.entityId} entityType={commentEntityType.entityType} />
        {isLoading ? (
          "loading"
        ) : (
          <>
            {totalCount ? (
              <div className="flex flex-col gap-2">
                {flatComments.map((comment) => (
                  <CommentCardComp key={comment.id} entitySlug={commentEntityType.entitySlug} entityType={commentEntityType.entityType} comment={comment} />
                ))}
              </div>
            ) : (
              <CommentEmptyStateComp />
            )}
            {hasNextPage ? (
              <Button disabled={isFetchingNextPage || isLoading} onClick={() => fetchNextPage()} className="h-10 px-8 w-fit mx-auto rounded-md cursor-pointer border-gray-10 text-gray-10 hover:text-primary hover:border-primary hover:[&>svg]:stroke-primary" variant="outline">
                مشاهده بیشتر {isFetchingNextPage ? <Spinner /> : <ArrowDown2 className="stroke-gray-10 size-5 transition-all" />}
              </Button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default CommentSectionComp;
