import { Play } from "iconsax-react";
import Link from "next/link";
import { Button } from "../../../ui";
import { MovieDetailPublicType, MovieListItemType, MovieTypeEnum, UserMovieActionType, UserMovieTypeEnum, WatchTargetMovieTypeEnum } from "../../../../../types";

function MoviePlayFunctionalityComp({ movie, hero, actions }: { movie: MovieDetailPublicType | MovieListItemType; hero: boolean; actions?: UserMovieActionType[] }) {
  const isWatching = actions?.some((action) => action.type === UserMovieTypeEnum.WATCHING);
  const isWatched = actions?.some((action) => action.type === UserMovieTypeEnum.WATCHED);
  const isSeries = movie.type === MovieTypeEnum.SERIES;

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

  const watchTarget = "watch_target" in movie ? movie.watch_target : undefined;

  let label = "تماشا";

  if (!isSeries) {
    if (isWatching) {
      label = "ادامه تماشا";
    } else if (isWatched) {
      label = "تماشای دوباره";
    }
  } else if (watchTarget?.type === WatchTargetMovieTypeEnum.CONTINUE) {
    label = "ادامه تماشا";
  } else if (watchTarget?.type === WatchTargetMovieTypeEnum.REWATCH) {
    label = "تماشای دوباره";
  } else if (watchTarget?.type === WatchTargetMovieTypeEnum.WATCH) {
    label = watchTarget?.season_order === 1 ? `تماشای قسمت ${watchTarget?.order}` : `تماشای فصل ${watchTarget?.season_order} قسمت ${watchTarget?.order}`;
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
