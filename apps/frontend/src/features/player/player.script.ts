import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { CommentEntityTypeEnum, UserMovieTypeEnum } from "../../types";

export function useSaveWatchTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["save-watch-time"],
    mutationFn: async ({ entityId, entityType, progressTime, type }: { entityId: number; entityType: CommentEntityTypeEnum; progressTime: number; type: UserMovieTypeEnum }) => {
      return ClientCall(AppApis.userMovie.index, {
        method: "POST",
        body: {
          ...(entityType === CommentEntityTypeEnum.MOVIE ? { movie_id: entityId } : { episode_id: entityId }),
          type,
          entity_type: entityType,
          progress_time: Math.floor(progressTime),
        },
      });
    },
    onSuccess: (_result, { entityId, entityType }) => {
      queryClient.invalidateQueries({
        queryKey: ["user-movie-actions", entityType, entityId],
        refetchType: "none",
      });
      queryClient.invalidateQueries({ queryKey: ["episodes"], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["player-episodes"], refetchType: "none" });
    },
  });
}
