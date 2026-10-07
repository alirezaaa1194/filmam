// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { ClientCall } from "@/scripts/client";
// import { AppApis } from "@/data";
// import { toast } from "sonner";
// import { CommentEntityTypeEnum, SectionUserMovieTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "@/types";

// type ToggleActionParams = {
//   entityId: number;
//   isCurrentlySaved: boolean;
// };

// const OPPOSITE_TYPE: Partial<Record<UserMovieTypeEnum, UserMovieTypeEnum>> = {
//   [UserMovieTypeEnum.LIKE]: UserMovieTypeEnum.DISLIKE,
//   [UserMovieTypeEnum.DISLIKE]: UserMovieTypeEnum.LIKE,
// };

// export function useMovieAction(entityId: number, type: UserMovieTypeEnum, successMessage?: string, disSuccessMessage?: string, errorMessage?: string, entityType: CommentEntityTypeEnum = CommentEntityTypeEnum.MOVIE) {
//   const queryClient = useQueryClient();
//   const oppositeType = OPPOSITE_TYPE[type];

//   const toggleMutation = useMutation({
//     mutationKey: ["user-action", entityType, entityId],
//     mutationFn: async ({ entityId }: ToggleActionParams) => {
//       return ClientCall(AppApis.userMovie.index, {
//         method: "POST",
//         body: {
//           ...(entityType === CommentEntityTypeEnum.MOVIE ? { movie_id: entityId } : { episode_id: entityId }),
//           type,
//           entity_type: entityType,
//         },
//       });
//     },

//     onMutate: async ({ entityId, isCurrentlySaved }) => {
//       await queryClient.cancelQueries({
//         queryKey: ["user-movie-actions", entityId],
//       });

//       const previousActions = queryClient.getQueryData(["user-movie-actions", entityId]);

//       queryClient.setQueryData(["user-movie-actions", entityId], (old: UserMovieActionType[] | undefined) => {
//         if (!old) return old;

//         if (isCurrentlySaved) {
//           return old.filter((a) => a.type !== type);
//         }

//         let newActions = old;

//         if (oppositeType) {
//           newActions = newActions.filter((a) => a.type !== oppositeType);
//         }

//         return [...newActions, { type, movie_id: entityId } as UserMovieActionType];
//       });

//       if (isCurrentlySaved) {
//         if (disSuccessMessage) {
//           toast.success(disSuccessMessage);
//         }
//       } else {
//         if (successMessage) {
//           toast.success(successMessage);
//         }
//       }

//       return { previousActions };
//     },

//     onError: async (_error, { entityId }, context) => {
//       await new Promise((r) => setTimeout(r, 0));

//       const isMutating = queryClient.isMutating({
//         mutationKey: ["movie-action", entityId],
//       });

//       if (isMutating === 0 && context?.previousActions) {
//         queryClient.setQueryData(["user-movie-actions", entityId], context.previousActions);
//       }

//       if (isMutating === 0) {
//         if (errorMessage) {
//           toast.error(errorMessage);
//         }
//       }
//     },

//     onSettled: async (_data, _err, { entityId }) => {
//       await new Promise((r) => setTimeout(r, 0));

//       const isMutating = queryClient.isMutating({
//         mutationKey: ["movie-action", entityId],
//       });

//       if (isMutating === 0) {
//         queryClient.invalidateQueries({
//           queryKey: ["user-movie-actions", entityId],
//         });
//       }
//     },
//   });

//   return {
//     toggleAction: (params: ToggleActionParams) => toggleMutation.mutate(params),
//     isLoading: toggleMutation.isPending,
//   };
// }



"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { toast } from "sonner";
import {
  CommentEntityTypeEnum,
  UserMovieActionType,
  UserMovieTypeEnum,
} from "@/types";

/* ---------------- Types ---------------- */

type BaseHookProps = {
  successMessage?: string;
  disSuccessMessage?: string;
  errorMessage?: string;
};

type MovieHookProps = BaseHookProps & {
  entityType: CommentEntityTypeEnum.MOVIE;
  entityId: number;
  type: UserMovieTypeEnum;
};

type EpisodeHookProps = BaseHookProps & {
  entityType: CommentEntityTypeEnum.EPISODE;
  entityId: number;
  type: UserMovieTypeEnum;
};

export type UseMovieActionProps = MovieHookProps | EpisodeHookProps;

type ToggleActionParams = {
  entityId: number;
  isCurrentlySaved: boolean;
};

/* ---------------- Constants ---------------- */

const OPPOSITE_TYPE: Partial<Record<UserMovieTypeEnum, UserMovieTypeEnum>> = {
  [UserMovieTypeEnum.LIKE]: UserMovieTypeEnum.DISLIKE,
  [UserMovieTypeEnum.DISLIKE]: UserMovieTypeEnum.LIKE,
};

/* ---------------- Hook ---------------- */

export function useMovieAction({
  entityId,
  entityType = CommentEntityTypeEnum.MOVIE,
  type,
  successMessage,
  disSuccessMessage,
  errorMessage,
}: UseMovieActionProps) {
  const queryClient = useQueryClient();
  const oppositeType = OPPOSITE_TYPE[type];

  // کلید مشترک برای همه‌ی mutationها و کش
  const actionsKey = ["user-movie-actions", entityType, entityId] as const;
  const mutationKey = ["user-movie-action", entityType, entityId] as const;

  const toggleMutation = useMutation({
    mutationKey,
    mutationFn: async ({ entityId }: ToggleActionParams) => {
      return ClientCall(AppApis.userMovie.index, {
        method: "POST",
        body: {
          ...(entityType === CommentEntityTypeEnum.MOVIE
            ? { movie_id: entityId }
            : { episode_id: entityId }),
          type,
          entity_type: entityType,
        },
      });
    },

    onMutate: async ({ entityId, isCurrentlySaved }) => {
      await queryClient.cancelQueries({ queryKey: actionsKey });

      const previousActions =
        queryClient.getQueryData<UserMovieActionType[]>(actionsKey);

      queryClient.setQueryData<UserMovieActionType[]>(actionsKey, (old) => {
        if (!old) return old;

        // اگه از قبل ذخیره شده → حذفش کن (toggle off)
        if (isCurrentlySaved) {
          return old.filter((a) => a.type !== type);
        }

        // وگرنه اضافه کن و نوع مخالف رو حذف کن
        let newActions = old;
        if (oppositeType) {
          newActions = newActions.filter((a) => a.type !== oppositeType);
        }

        return [...newActions, { type, movie_id: entityId } as UserMovieActionType];
      });

      // toast خوش‌بینانه
      if (isCurrentlySaved) {
        if (disSuccessMessage) toast.success(disSuccessMessage);
      } else {
        if (successMessage) toast.success(successMessage);
      }

      return { previousActions };
    },

    onError: (_error, _vars, context) => {
      // برگردوندن حالت قبلی
      if (context?.previousActions !== undefined) {
        queryClient.setQueryData(actionsKey, context.previousActions);
      }
      if (errorMessage) toast.error(errorMessage);
    },

    onSettled: () => {
      // فقط بعد از تمام شدن همه‌ی mutationهای همین انتیتی invalidate کن
      const isMutating = queryClient.isMutating({ mutationKey });
      if (isMutating === 0) {
        queryClient.invalidateQueries({ queryKey: actionsKey });
      }
    },
  });

  return {
    toggleAction: (params: ToggleActionParams) => toggleMutation.mutate(params),
    isLoading: toggleMutation.isPending,
  };
}