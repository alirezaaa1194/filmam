import Image from "next/image";
import Link from "next/link";
import { Slider } from "../../../ui/slider";
import { FileTypeEnum, SectionUserMovieListItemType, SectionUserMovieTypeEnum } from "../../../../../types";
import { TimerParser } from "../../../../../scripts";
import { useLocale } from "@/hooks";
function RecentWatchItemComp({ movie }: { movie: SectionUserMovieListItemType }) {
  const { t, dir } = useLocale();
  let moviePoster = null;
  let movieFilm = null;

  if (movie.entity_type === SectionUserMovieTypeEnum.EPISODE) {
    moviePoster = movie.episode.files.find((file) => file.type === FileTypeEnum.POSTER);
  } else {
    moviePoster = movie.movie.files.find((file) => file.type === FileTypeEnum.POSTER);
  }

  if (movie.entity_type === SectionUserMovieTypeEnum.EPISODE) {
    movieFilm = movie.episode.files.find((file) => file.type === FileTypeEnum.FILM);
  } else {
    movieFilm = movie.movie.files.find((file) => file.type === FileTypeEnum.FILM);
  }
  const title = movie.entity_type === SectionUserMovieTypeEnum.MOVIE ? movie.movie.title : `${dir === "rtl" ? `${t("RecentWatch.series")} ${movie.movie.title}` : `${movie.movie.title} ${t("RecentWatch.series")}`} - ${t("RecentWatch.season")} ${movie.episode.season_order} - ${t("RecentWatch.episode")} ${movie.episode.order}`;

  const placeholderPath = "/images/placeholder-h.jpg";

  return (
    <Link href="/" className="block relative rounded-md lg:rounded-xl overflow-hidden select-none h-40 xl:h-60">
      <Image src={moviePoster?.path || placeholderPath} alt={moviePoster?.alt_text || title} draggable={false} width={392} height={239} className="h-full object-top w-full object-cover bg-gray-11" />
      <div className="absolute rounded-b-md lg:rounded-b-xl bottom-0 left-0 bg-black/70 backdrop-blur-[15px] w-full z-10 flex flex-col gap-px p-2">
        <span className="text-white text-caption-sm lg:text-body-xxs">{title}</span>
        <div className="w-full flex items-center justify-between gap-4">
          <span className={`shrink-0 lg:text-caption-md text-caption-sm ${dir === "rtl" ? "order-1" : "order-3"}`}>{TimerParser(isNaN(Number(movieFilm?.duration)) ? 0 : Number(movieFilm?.duration), true)}</span>
          <Slider defaultValue={[(movie.progress_time / (isNaN(Number(movieFilm?.duration)) ? 0 : Number(movieFilm?.duration))) * 100]} max={100} step={1} min={0} dir="ltr" disabled className="order-2" />
          <span className={`shrink-0 lg:text-caption-md text-caption-sm ${dir === "rtl" ? "order-3" : "order-1"}`}>{TimerParser(Number(movie.progress_time), true)}</span>
        </div>
      </div>
    </Link>
  );
}

export default RecentWatchItemComp;
