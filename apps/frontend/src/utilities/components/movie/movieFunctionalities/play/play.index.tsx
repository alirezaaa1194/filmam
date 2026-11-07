import { Play } from "iconsax-react";
import Link from "next/link";
import { Button } from "../../../ui";
import { FileTypeEnum, MovieDetailPublicType, MovieListItemType, MovieTypeEnum, UserMovieActionType, UserMovieTypeEnum, WatchTargetMovieTypeEnum } from "../../../../../types";
import { useLocale } from "../../../../../hooks";

function MoviePlayFunctionalityComp({ movie, hero, actions }: { movie: MovieDetailPublicType | MovieListItemType; hero: boolean; actions?: UserMovieActionType[] }) {
  const isWatching = actions?.some((action) => action.type === UserMovieTypeEnum.WATCHING);
  const isWatched = actions?.some((action) => action.type === UserMovieTypeEnum.WATCHED);
  const isSeries = movie.type === MovieTypeEnum.SERIES;
  const { t } = useLocale();

  if (hero) {
    return (
      <Link href={`/movies/${movie.slug}`} className="w-full lg:w-fit">
        <Button className="w-full lg:w-fit flex items-center gap-2 px-12 h-[46px] rounded-md cursor-pointer text-white text-button-md! lg:text-button-lg!">
          <Play variant="Outline" className="fill-white size-5" />
          {t("MovieDetail.watch")}
        </Button>
      </Link>
    );
  }

  const watchTarget = "watch_target" in movie ? movie.watch_target : undefined;

  let label = t("MovieDetail.watch");

  if (!isSeries) {
    if (isWatching) {
      label = t("MovieDetail.continueWatching");
    } else if (isWatched) {
      label = t("MovieDetail.watchAgain");
    }
  } else if (watchTarget?.type === WatchTargetMovieTypeEnum.CONTINUE) {
    label = t("MovieDetail.continueWatching");
  } else if (watchTarget?.type === WatchTargetMovieTypeEnum.REWATCH) {
    label = t("MovieDetail.watchAgain");
  } else if (watchTarget?.type === WatchTargetMovieTypeEnum.WATCH) {
    label = watchTarget?.season_order === 1
      ? `${t("MovieDetail.watchEpisode")} ${watchTarget?.order}`
      : `${t("MovieDetail.watchSeason")} ${watchTarget?.season_order} ${t("Player.episode")} ${watchTarget?.order}`;
  }
  const filmFile = watchTarget?.files.find((file) => file.type === FileTypeEnum.FILM);
  if (!filmFile) {
    return;
  }

  return (
    <Link href={`/player/episode/${watchTarget?.slug}?source=FILM`} className="w-full lg:w-fit">
      <Button className="w-full lg:w-fit flex items-center gap-2 px-12 h-[46px] rounded-md cursor-pointer text-white text-button-md! lg:text-button-lg!">
        <Play variant="Outline" className="fill-white size-5" />
        {label}
      </Button>
    </Link>
  );
}

export default MoviePlayFunctionalityComp;
