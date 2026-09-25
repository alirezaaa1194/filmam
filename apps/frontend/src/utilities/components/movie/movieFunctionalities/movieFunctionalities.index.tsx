import MovieSaveFunctionalityComp from "./save/save.index";
import MovieNotificationFunctionalityComp from "./notification/notification.index";
import MovieLikeFunctionalityComp from "./like/like.index";
import MovieDislikeFunctionalityComp from "./dislike/dislike.index";
import { useQuery } from "@tanstack/react-query";
import { FileTypeEnum, MovieTypeEnum, SectionUserMovieTypeEnum, UserMovieActionType } from "../../../../types";
import { AppApis } from "../../../../data";
import { ClientCall } from "../../../../scripts/client";
import { useLocale } from "../../../../hooks";
import MovieFunctionalitiesSkeletonComp from "./skeleton/movieFunctionalitiesSkeleton.index";
import { MovieFunctionalitiesProps } from "./movieFunctionalities.type";
import MovieDownloadFunctionalityComp from "./download/donwload.index";
import MoviePlayFunctionalityComp from "./play/play.index";
import MovieTrailerFunctionalityComp from "./trailer/trailer.index";

function MovieFunctionalitiesComp({ movie, save = true, notification = true, like = true, dislike = true, play = false, download = true, trailer, hero = false }: MovieFunctionalitiesProps) {
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

  const hasTrailer = movie.files.some((file) => file.type === FileTypeEnum.TRAILER);

  return (
    <div className="w-full flex items-center justify-between lg:gap-4">
      <div className="flex items-center flex-col lg:flex-row lg:justify-start gap-3 lg:gap-4 w-full">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 w-full lg:w-fit">
          {play ? <MoviePlayFunctionalityComp movie={movie} hero={hero} actions={data} /> : null}
          {trailer && hasTrailer && !hero ? <MovieTrailerFunctionalityComp movie={movie} /> : null}
        </div>
        {!hero ? (
          <div className="w-full flex items-center lg:justify-start gap-2 lg:gap-3">
            {save ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieSaveFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
            {notification && movie.type === MovieTypeEnum.SERIES ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieNotificationFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
            {like ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieLikeFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
            {dislike ? isPending ? <MovieFunctionalitiesSkeletonComp /> : <MovieDislikeFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
            {!hero ? <MovieDownloadFunctionalityComp movie={movie} className="block flex-1 lg:hidden" /> : null}
          </div>
        ) : null}
      </div>
      {!hero ? <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">{movie.type === MovieTypeEnum.CINEMATIC && download ? <MovieDownloadFunctionalityComp movie={movie} className="hidden lg:block" /> : null}</div> : null}
    </div>
  );
}

export default MovieFunctionalitiesComp;
