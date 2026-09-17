import MovieSaveFunctionalityComp from "./save/save.index";
import MovieNotificationFunctionalityComp from "./notification/notification.index";
import MovieLikeFunctionalityComp from "./like/like.index";
import MovieDislikeFunctionalityComp from "./dislike/dislike.index";
import { useQuery } from "@tanstack/react-query";
import { SectionUserMovieTypeEnum, UserMovieActionType } from "../../../../types";
import { AppApis } from "../../../../data";
import { ClientCall } from "../../../../scripts/client";
import { useLocale } from "../../../../hooks";
import MovieFunctionalitiesSkeletonComp from "./skeleton/movieFunctionalitiesSkeleton.index";

function MovieFunctionalitiesComp({ movieId, save = true, notification = true, like = true, dislike = true }: { movieId: number; save?: boolean; notification?: boolean; like?: boolean; dislike?: boolean }) {
  const { locale } = useLocale();
  const { data, isPending } = useQuery({
    queryKey: ["user-movie-actions", movieId],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(movieId), {
        method: "GET",
        locale,
        query: {
          entity_type: SectionUserMovieTypeEnum.MOVIE,
        },
      }),
  });

  return (
    <div className="w-full flex items-center justify-between gap-4">
      <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
        {save ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieSaveFunctionalityComp movieId={movieId} actions={data || []} /> : null}
        {notification ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieNotificationFunctionalityComp movieId={movieId} actions={data || []} /> : null}
        {like ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieLikeFunctionalityComp movieId={movieId} actions={data || []} /> : null}
        {dislike ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieDislikeFunctionalityComp movieId={movieId} actions={data || []} /> : null}
      </div>
      {dislike ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieDislikeFunctionalityComp movieId={movieId} actions={data || []} /> : null}
    </div>
  );
}

export default MovieFunctionalitiesComp;
