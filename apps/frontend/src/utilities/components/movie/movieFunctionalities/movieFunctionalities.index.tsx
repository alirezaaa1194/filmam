import MovieSaveFunctionalityComp from "./save/save.index";
import MovieNotificationFunctionalityComp from "./notification/notification.index";
import MovieLikeFunctionalityComp from "./like/like.index";
import MovieDislikeFunctionalityComp from "./dislike/dislike.index";
import { useQuery } from "@tanstack/react-query";
import { FileTypeEnum, MovieTypeEnum, SectionUserMovieTypeEnum, UserMovieActionType } from "../../../../types";
import { AppApis } from "../../../../data";
import { ClientCall } from "../../../../scripts/client";
import { useLocale } from "../../../../hooks";
import { MovieFunctionalitiesProps } from "./movieFunctionalities.type";
import MovieDownloadFunctionalityComp from "./download/donwload.index";
import MoviePlayFunctionalityComp from "./play/play.index";
import MovieTrailerFunctionalityComp from "./trailer/trailer.index";
import { use } from "react";
import { UserContext } from "../../../../contexts";
import MovieFunctionalitySkeletonComp from "./skeleton/buttonSkeleton/buttonSkeleton.index";

function MovieFunctionalitiesComp({ movie, save = true, notification = true, like = true, dislike = true, play = false, download = true, trailer, hero = false }: MovieFunctionalitiesProps) {
  const { locale } = useLocale();
  const user = use(UserContext);

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
    enabled: !!user,
  });

  const hasTrailer = movie.files.some((file) => file.type === FileTypeEnum.TRAILER);

  return (
    <div className="flex items-center flex-col lg:flex-row lg:justify-start gap-4 w-full">
      <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-fit">
        {play ? <MoviePlayFunctionalityComp movie={movie} hero={hero} actions={data} /> : null}
        {trailer && hasTrailer && !hero ? <MovieTrailerFunctionalityComp movie={movie} /> : null}
      </div>
      {!hero ? (
        <div className="w-full flex items-center lg:justify-start gap-4">
          {save ? user && isPending ? <MovieFunctionalitySkeletonComp /> : <MovieSaveFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
          {notification && movie.type === MovieTypeEnum.SERIES ? user && isPending ? <MovieFunctionalitySkeletonComp /> : <MovieNotificationFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
          {like ? user && isPending ? <MovieFunctionalitySkeletonComp /> : <MovieLikeFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
          {dislike ? user && isPending ? <MovieFunctionalitySkeletonComp /> : <MovieDislikeFunctionalityComp movieId={movie.id} actions={data || []} /> : null}
          {!hero && movie.type === MovieTypeEnum.CINEMATIC && download ? <MovieDownloadFunctionalityComp movie={movie} /> : null}
        </div>
      ) : null}
    </div>
  );
}

export default MovieFunctionalitiesComp;
