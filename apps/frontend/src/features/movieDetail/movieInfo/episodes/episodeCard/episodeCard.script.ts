"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { toast } from "sonner";
import {
  SectionUserMovieTypeEnum,
  PaginationType,
  SeasonEpisodeType,
  UserMovieTypeEnum,
} from "@/types";

// ═══════════════════════════════════════════════
// نگاشت type به مخالفش
// ═══════════════════════════════════════════════

const OPPOSITE_TYPE: Partial<Record<UserMovieTypeEnum, UserMovieTypeEnum>> = {
  [UserMovieTypeEnum.LIKE]: UserMovieTypeEnum.DISLIKE,
  [UserMovieTypeEnum.DISLIKE]: UserMovieTypeEnum.LIKE,
};

// ═══════════════════════════════════════════════
// تایپ‌های کمکی
// ═══════════════════════════════════════════════

type ToggleEpisodeActionParams = {
  episodeId: number;
  isCurrentlySaved: boolean;
};

type InfiniteEpisodesData = {
  pages: PaginationType<SeasonEpisodeType>[];
  pageParams: unknown[];
};

// ═══════════════════════════════════════════════
// هوک: toggle اکشن اپیزود
// ═══════════════════════════════════════════════

export function useEpisodeAction(
  activeTab: string,
  type: UserMovieTypeEnum,
  successMessage: string,
  disSuccessMessage: string,
  errorMessage: string,
) {
  const queryClient = useQueryClient();
  const oppositeType = OPPOSITE_TYPE[type];

  const toggleMutation = useMutation({
    mutationKey: ["episode-action", activeTab],

    mutationFn: async ({ episodeId }: ToggleEpisodeActionParams) => {
      return ClientCall(AppApis.userMovie.index, {
        method: "POST",
        body: {
          episode_id: episodeId,
          type,
          entity_type: SectionUserMovieTypeEnum.EPISODE,
        },
      });
    },

    onMutate: async ({ episodeId, isCurrentlySaved }) => {
      await queryClient.cancelQueries({
        queryKey: ["episodes", activeTab],
      });

      // ✅ همه‌ی queryKey هایی که با ["episodes", activeTab] شروع می‌شن
      const previousData = queryClient.getQueriesData<InfiniteEpisodesData>({
        queryKey: ["episodes", activeTab],
      });

      queryClient.setQueriesData<InfiniteEpisodesData>(
        { queryKey: ["episodes", activeTab] },
        (old) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((episode) => {
                if (episode.id !== episodeId) return episode;

                // ✅ user_movies فعلی این اپیزود
                const currentUserMovies = episode.user_movies ?? [];

                // آیدی که برای اکشن مخالف داریم (اگه هست)
                const oppositeAction = oppositeType
                  ? currentUserMovies.find((a) => a.type === oppositeType)
                  : undefined;

                let newUserMovies;

                if (isCurrentlySaved) {
                  // ─── حذف ───
                  newUserMovies = currentUserMovies.filter(
                    (a) => a.type !== type,
                  );
                } else {
                  // ─── اضافه + حذف مخالف ───
                  let filtered = currentUserMovies;
                  if (oppositeAction) {
                    filtered = filtered.filter((a) => a.type !== oppositeType);
                  }
                  newUserMovies = [
                    ...filtered,
                    {
                      // آیدی موقت (چون هنوز از بک‌اند نیومده)
                      // بعد از invalidate، آیدی واقعی جایگزین می‌شه
                      id: -Date.now(),
                      type,
                    },
                  ];
                }

                return {
                  ...episode,
                  user_movies: newUserMovies,
                };
              }),
            })),
          };
        },
      );

      if (isCurrentlySaved) {
        toast.success(disSuccessMessage);
      } else {
        toast.success(successMessage);
      }

      return { previousData };
    },

    onError: async (_error, _vars, context) => {
      await new Promise((r) => setTimeout(r, 0));

      const isMutating = queryClient.isMutating({
        mutationKey: ["episode-action", activeTab],
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
        mutationKey: ["episode-action", activeTab],
      });

      if (isMutating === 0) {
        queryClient.invalidateQueries({
          queryKey: ["episodes", activeTab],
        });
      }
    },
  });

  return {
    toggleEpisodeAction: (params: ToggleEpisodeActionParams) =>
      toggleMutation.mutate(params),
    isLoading: toggleMutation.isPending,
  };
}