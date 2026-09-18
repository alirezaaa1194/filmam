import { ArrowDown2, Message2 } from "iconsax-react";
import { Button, Spinner } from "../../ui";
import CommentCardComp from "./commentCard/commentCard.index";
import CommentInputComp from "./commentInput/commentInput.index";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "../../../../hooks";
import { ClientCall } from "../../../../scripts/client";
import { CommentEntityTypeEnum, CommentType, PaginationType, SortTypeEnum } from "../../../../types";
import { AppApis } from "../../../../data";
import { useState } from "react";
import CommentEntityPickerComp from "./commentEntityPicker/commentEntityPicker.index";

function CommentSectionComp({ entitySlug, entityId, entityType, movieTitle }: { entitySlug: string; entityId: number; entityType: CommentEntityTypeEnum; movieTitle?: string }) {
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
    isError,
    error,
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
      const loadedCount: any = allPages.reduce((sum, page: any) => sum + (page.data?.length ?? 0), 0);

      if (loadedCount < lastPage.count) {
        return lastPage.page + 1;
      }

      return undefined;
    },
  });

  return (
    <section className="px-layout-x-space max-w-layout-max mx-auto mt-10 lg:mt-14 flex flex-col gap-6 lg:gap-12">
      <h5 className="text-mobile-h-5 lg:text-h-5">دیدگاه ها</h5>
      <div className="flex flex-col gap-3">
        {entityType === CommentEntityTypeEnum.MOVIE ? <CommentEntityPickerComp movieSlug={entitySlug} movieId={entityId} movieTitle={movieTitle} commentEntityType={commentEntityType} setCommentEntityType={setCommentEntityType} /> : null}

        <CommentInputComp entityId={commentEntityType.entityId} entityType={commentEntityType.entityType} />

        {isLoading ? (
          "loading"
        ) : (
          <>
            {comments?.pages[0].count ? (
              <div className="flex flex-col gap-2">{comments?.pages.map((page) => page.data.map((comment) => <CommentCardComp key={comment.id} entitySlug={commentEntityType.entitySlug} entityType={commentEntityType.entityType} comment={comment} />))}</div>
            ) : (
              <div className="bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl flex flex-col items-center justify-center gap-5 lg:gap-6 py-16 lg:py-20">
                <span className="size-14 lg:size-16 rounded-full bg-gray-12 border border-gray-11 flex items-center justify-center">
                  <Message2 variant="Outline" className="size-7 fill-primary" />
                </span>
                <div className="flex flex-col gap-2 items-center">
                  <h5 className="text-h-6 lg:text-h-5">کامنتی وجود ندارد</h5>
                  <span className="text-caption-md lg:text-caption-lg text-gray-7">اولین نفری باشید که نظر میدهید</span>
                </div>
              </div>
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
