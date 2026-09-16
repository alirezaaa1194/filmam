"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { toast } from "sonner";
import { SectionUserMovieTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "@/types";

type ToggleActionParams = {
  movieId: number;
  isCurrentlySaved: boolean;
};

const OPPOSITE_TYPE: Partial<Record<UserMovieTypeEnum, UserMovieTypeEnum>> = {
  [UserMovieTypeEnum.LIKE]: UserMovieTypeEnum.DISLIKE,
  [UserMovieTypeEnum.DISLIKE]: UserMovieTypeEnum.LIKE,
};

export function useMovieAction(movieId: number, type: UserMovieTypeEnum, successMessage: string, disSuccessMessage: string, errorMessage: string) {
  const queryClient = useQueryClient();
  const oppositeType = OPPOSITE_TYPE[type];

  const toggleMutation = useMutation({
    mutationKey: ["movie-action", movieId],
    mutationFn: async ({ movieId }: ToggleActionParams) => {
      return ClientCall(AppApis.userMovie.index, {
        method: "POST",
        body: {
          movie_id: movieId,
          type,
          entity_type: SectionUserMovieTypeEnum.MOVIE,
        },
      });
    },

    onMutate: async ({ movieId, isCurrentlySaved }) => {
      await queryClient.cancelQueries({
        queryKey: ["user-movie-actions", movieId],
      });

      const previousActions = queryClient.getQueryData(["user-movie-actions", movieId]);

      queryClient.setQueryData(["user-movie-actions", movieId], (old: UserMovieActionType[] | undefined) => {
        if (!old) return old;

        if (isCurrentlySaved) {
          return old.filter((a) => a.type !== type);
        }

        let newActions = old;

        if (oppositeType) {
          newActions = newActions.filter((a) => a.type !== oppositeType);
        }

        return [...newActions, { type, movie_id: movieId } as UserMovieActionType];
      });

      if (isCurrentlySaved) {
        toast.success(disSuccessMessage);
      } else {
        toast.success(successMessage);
      }

      return { previousActions };
    },

    onError: async (_error, { movieId }, context) => {
      await new Promise((r) => setTimeout(r, 0));

      const isMutating = queryClient.isMutating({
        mutationKey: ["movie-action", movieId],
      });

      if (isMutating === 0 && context?.previousActions) {
        queryClient.setQueryData(["user-movie-actions", movieId], context.previousActions);
      }

      if (isMutating === 0) {
        toast.error(errorMessage);
      }
    },

    onSettled: async (_data, _err, { movieId }) => {
      await new Promise((r) => setTimeout(r, 0));

      const isMutating = queryClient.isMutating({
        mutationKey: ["movie-action", movieId],
      });

      if (isMutating === 0) {
        queryClient.invalidateQueries({
          queryKey: ["user-movie-actions", movieId],
        });
      }
    },
  });

  return {
    toggleAction: (params: ToggleActionParams) => toggleMutation.mutate(params),
    isLoading: toggleMutation.isPending,
  };
}
