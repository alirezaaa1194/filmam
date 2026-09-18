"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { toast } from "sonner";
import { CommentEntityTypeEnum, CommentType, PaginationType, UserMovieTypeEnum } from "@/types";
import { useLocale } from "../../../../../hooks";

type VoteParams = {
  commentId: number;
  isCurrentlyVoted: boolean;
};

type InfiniteCommentsData = {
  pages: PaginationType<CommentType>[];
  pageParams: unknown[];
};

export function useCommentVote(slug: string, entityType: CommentEntityTypeEnum, voteStatus: UserMovieTypeEnum, successMessage: string, disSuccessMessage: string, errorMessage: string) {
  const queryClient = useQueryClient();
  const { locale } = useLocale();

  const voteMutation = useMutation({
    mutationKey: ["comment-vote", slug],

    mutationFn: async ({ commentId }: VoteParams) => {
      return ClientCall(AppApis.comment.vote(commentId), {
        method: "POST",
        body: { vote_status: voteStatus },
      });
    },

    onMutate: async ({ commentId, isCurrentlyVoted }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", entityType, slug, locale],
      });

      const previousData = queryClient.getQueriesData<InfiniteCommentsData>({
        queryKey: ["comments", entityType, slug, locale],
      });

      queryClient.setQueriesData<InfiniteCommentsData>({ queryKey: ["comments", entityType, slug, locale] }, (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((comment) => {
              if (comment.id !== commentId) return comment;

              const isLiked = voteStatus === UserMovieTypeEnum.LIKE;

              // ─── محاسبه‌ی counts ───
              let likesCount = comment.likes_count;
              let dislikesCount = comment.dislikes_count;
              let didUserLiked = comment.did_user_liked;
              let didUserDisliked = comment.did_user_disliked;

              if (isCurrentlyVoted) {
                // ─── حذف رأی ───
                if (isLiked) {
                  likesCount -= 1;
                  didUserLiked = false;
                } else {
                  dislikesCount -= 1;
                  didUserDisliked = false;
                }
              } else {
                // ─── اضافه کردن رأی + حذف مخالف ───
                if (isLiked) {
                  likesCount += 1;
                  didUserLiked = true;

                  // اگه dislike داشت، حذفش کن
                  if (didUserDisliked) {
                    dislikesCount -= 1;
                    didUserDisliked = false;
                  }
                } else {
                  dislikesCount += 1;
                  didUserDisliked = true;

                  // اگه like داشت، حذفش کن
                  if (didUserLiked) {
                    likesCount -= 1;
                    didUserLiked = false;
                  }
                }
              }

              return {
                ...comment,
                likes_count: likesCount,
                dislikes_count: dislikesCount,
                did_user_liked: didUserLiked,
                did_user_disliked: didUserDisliked,
              };
            }),
          })),
        };
      });

      // ✅ توست فوری
      if (isCurrentlyVoted) {
        toast.success(disSuccessMessage);
      } else {
        toast.success(successMessage);
      }

      return { previousData };
    },

    onError: async (_error, _vars, context) => {
      await new Promise((r) => setTimeout(r, 0));

      const isMutating = queryClient.isMutating({
        mutationKey: ["comment-vote", slug],
      });

      if (isMutating === 0 && context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
        toast.error(errorMessage);
      }
    },

    onSettled: async () => {
      await new Promise((r) => setTimeout(r, 0));

      const isMutating = queryClient.isMutating({
        mutationKey: ["comment-vote", slug],
      });

      if (isMutating === 0) {
        queryClient.invalidateQueries({
          queryKey: ["comments", entityType, slug, locale],
        });
      }
    },
  });

  return {
    vote: (params: VoteParams) => voteMutation.mutate(params),
    isLoading: voteMutation.isPending,
  };
}
