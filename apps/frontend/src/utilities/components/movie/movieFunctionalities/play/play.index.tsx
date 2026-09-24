import { Play } from "iconsax-react";
import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../../../ui";

import { MovieDetailPublicType, MovieListItemType, MovieTypeEnum, UserMovieActionType, UserMovieTypeEnum, WatchTargetEpisodeType, WatchTargetMovieTypeEnum } from "../../../../../types";

import { useLocale } from "../../../../../hooks";
import { UserContext } from "../../../../../contexts";
import { AppApis } from "../../../../../data";
import { ClientCall } from "../../../../../scripts/client";

function MoviePlayFunctionalityComp({ movie, hero, actions }: { movie: MovieListItemType | MovieDetailPublicType; hero: boolean; actions?: UserMovieActionType[] }) {
  const { t } = useLocale();
  const user = use(UserContext);

  const isWatching = actions?.some((action) => action.type === UserMovieTypeEnum.WATCHING);

  const isWatched = actions?.some((action) => action.type === UserMovieTypeEnum.WATCHED);

  const isSeries = movie.type === MovieTypeEnum.SERIES;

  const { data, isPending } = useQuery({
    queryKey: ["movie-watch-target", movie.slug],
    queryFn: () =>
      ClientCall<WatchTargetEpisodeType>(AppApis.movie.watchTarget(movie.slug), {
        method: "GET",
      }),
    enabled: !!user && isSeries && !hero,
  });
  if (hero) {
    return (
      <Link href={`${hero ? `/movies/${movie.slug}` : ``}`} className="w-full lg:w-fit">
        <Button className="w-full lg:w-fit flex items-center gap-2 px-12 h-[46px] rounded-md cursor-pointer text-white text-button-md! lg:text-button-lg!">
          <Play variant="Outline" className="fill-white size-5" />
          تماشا
        </Button>
      </Link>
    );
  }

  let label = "تماشا";

  if (!isSeries) {
    if (isWatching) {
      label = "ادامه تماشا";
    } else if (isWatched) {
      label = "تماشای دوباره";
    }
  } else if (data?.type === WatchTargetMovieTypeEnum.CONTINUE) {
    label = "ادامه تماشا";
  } else if (data?.type === WatchTargetMovieTypeEnum.REWATCH) {
    label = "تماشای دوباره";
  } else if (data?.type === WatchTargetMovieTypeEnum.WATCH) {
    label = data.season_order === 1 ? `تماشای قسمت ${data.order}` : `تماشای فصل ${data.season_order} قسمت ${data.order}`;
  }

  if (user && isPending && movie.type === MovieTypeEnum.SERIES) {
    return "loading...";
  }

  return (
    <Link href={`${hero ? `/movies/${movie.slug}` : ``}`} className="w-full lg:w-fit">
      <Button className="w-full lg:w-fit flex items-center gap-2 px-12 h-[46px] rounded-md cursor-pointer text-white text-button-md! lg:text-button-lg!">
        <Play variant="Outline" className="fill-white size-5" />
        {label}
      </Button>
    </Link>
  );
}

export default MoviePlayFunctionalityComp;
