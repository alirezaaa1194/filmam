"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppApis } from "@/data";
import { ClientCall } from "@/scripts/client";
import { LocaleContext, UserContext } from "@/contexts";
import { useMovieAction } from "@/utilities/components/movie/movieFunctionalities/movieFunctionalities.script";
import { UserMovieActionType, UserMovieTypeEnum } from "@/types";
import { PlayerUserActionsProps } from "./userActions.type";

export function useUserActions({ entityType, entityId }: PlayerUserActionsProps) {
  const user = use(UserContext);
  const { locale } = use(LocaleContext);

  const { data, isPending } = useQuery({
    queryKey: ["user-movie-actions", entityType, entityId],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(entityId), {
        method: "GET",
        locale,
        query: { entity_type: entityType },
      }),
    enabled: !!user,
  });

  const didUserLiked = !!data?.some((a) => a.type === UserMovieTypeEnum.LIKE);
  const didUserDisLiked = !!data?.some((a) => a.type === UserMovieTypeEnum.DISLIKE);

  const { toggleAction: likeAction } = useMovieAction({ entityId, entityType, type: UserMovieTypeEnum.LIKE });
  const { toggleAction: dislikeAction } = useMovieAction({ entityId, entityType, type: UserMovieTypeEnum.DISLIKE });

  return {
    user,
    isPending,
    didUserLiked,
    didUserDisLiked,
    likeAction,
    dislikeAction,
  };
}
