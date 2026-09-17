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
import { MovieFunctionalitiesProps } from "./movieFunctionalities.type";
import MovieDownloadFunctionalityComp from "./download/donwload.index";
import MovieShareFunctionalityComp from "./share/share.index";
import MoviePlayFunctionalityComp from "./play/play.index";
import MovieTrailerFunctionalityComp from "./trailer/trailer.index";

function MovieFunctionalitiesComp({ movie, save = true, notification = true, like = true, dislike = true, play = false, share = false, download = false, trailer }: MovieFunctionalitiesProps) {
  const { locale } = useLocale();
  const { data, isPending } = useQuery({
    queryKey: ["user-movie-actions", movie.id],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(movie.id), {
        method: "GET",
        locale,
        query: {
          entity_type: SectionUserMovieTypeEnum.MOVIE,
        },
      }),
  });

  return (
    <div className="w-full flex items-center justify-between gap-4">
      <div className="flex items-center lg:justify-start gap-3 lg:gap-4">
        <div className="flex gap-2 lg:gap-3">
          {play ? <MoviePlayFunctionalityComp movie={movie} /> : null}
          <div className="hidden lg:block">{trailer ? <MovieTrailerFunctionalityComp movie={movie} /> : null}</div>
        </div>
        <div className="flex items-center lg:justify-start gap-2 lg:gap-3">
          {save ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieSaveFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
          {notification ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieNotificationFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
          {like ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieLikeFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
          {dislike ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieDislikeFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
        </div>
      </div>
      <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
        {download ? <MovieDownloadFunctionalityComp movie={movie} /> : null}
        {share ? <MovieShareFunctionalityComp /> : null}
      </div>
    </div>
  );
}

export default MovieFunctionalitiesComp;
