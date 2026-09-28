import { ArrowDown2 } from "iconsax-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import CommentCardComp from "./commentCard/commentCard.index";
import CommentInputComp from "./commentInput/commentInput.index";
import CommentSourcePickerComp from "./commentSourcePicker/commentSourcePicker.index";
import CommentEmptyStateComp from "./emptyState/emptyState.index";
import { useLocale } from "../../../../hooks";
import { ClientCall } from "../../../../scripts/client";
import { CommentEntityTypeEnum, CommentType, MovieTypeEnum, PaginationType, SortTypeEnum } from "../../../../types";
import { AppApis } from "../../../../data";
import { CommentSectionCompProps } from "./comment.type";
import { Button, Spinner } from "../../../../utilities/components/ui";
import { CommentCardSkeletonComp } from "./commentCard/skeleton/skeleton.index";

function CommentSectionComp({ movie }: CommentSectionCompProps) {
  const { locale } = useLocale();
  const [commentSource, setCommentSource] = useState({
    entityId: movie.id,
    entityType: CommentEntityTypeEnum.MOVIE,
    entitySlug: movie.slug,
  });

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", commentSource.entityType, commentSource.entitySlug, locale],
    queryFn: ({ pageParam = 1 }) =>
      ClientCall<PaginationType<CommentType>>(AppApis.comment.index(commentSource.entitySlug), {
        method: "GET",
        locale,
        query: {
          page: pageParam,
          page_size: 10,
          sort: SortTypeEnum.ASC,
          entity_type: commentSource.entityType,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const loadedCount = allPages.reduce((sum, page: any) => sum + (page.data?.length ?? 0), 0);
      return loadedCount < lastPage.count ? lastPage.page + 1 : undefined;
    },
  });

  const isShowSourcePicker = movie?.type === MovieTypeEnum.SERIES && ((movie.seasons_count ?? 1) > 1 || (movie.episodes_count ?? 1) > 1);
  const totalCount = comments?.pages?.[0]?.count ?? 0;
  const flatComments = comments?.pages.flatMap((page) => page.data ?? []) ?? [];

  return (
    <section className="w-full px-layout-x-space max-w-layout-max mx-auto flex flex-col gap-2 lg:gap-4">
      <h5 className="text-white text-mobile-h-5 lg:text-h-5">دیدگاه ها</h5>
      <div className="flex flex-col gap-3">
        {isShowSourcePicker ? <CommentSourcePickerComp movieSlug={movie.slug} movieId={movie.id} movieTitle={movie.title} commentSource={commentSource} setCommentSource={setCommentSource} /> : null}
        <CommentInputComp entityId={commentSource.entityId} entityType={commentSource.entityType} />
        {isLoading ? (
          <>
            <CommentCardSkeletonComp />
            <CommentCardSkeletonComp />
            <CommentCardSkeletonComp />
          </>
        ) : (
          <>
            {totalCount ? (
              <div className="flex flex-col gap-2">
                {flatComments.map((comment) => (
                  <CommentCardComp key={comment.id} entitySlug={commentSource.entitySlug} entityType={commentSource.entityType} comment={comment} />
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
