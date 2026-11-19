import Image from "next/image";
import Link from "next/link";
import { Slider } from "../../../../../utilities/components/ui/slider";
import { FileTypeEnum, SectionUserMovieListItemType, SectionUserMovieTypeEnum, UserMovieListItemType } from "../../../../../types";
import { TimerParser } from "../../../../../scripts";
import { useLocale } from "@/hooks";
function RecentWatchItemComp({ movie }: { movie: SectionUserMovieListItemType | UserMovieListItemType }) {
  const { t, dir } = useLocale();
  const parentMovie = movie.movie;
  if (!parentMovie) return null;
  let moviePoster = null;
  let movieFilm = null;

  if (movie.entity_type === SectionUserMovieTypeEnum.EPISODE && movie.episode) {
    moviePoster = movie.episode.files.find((file) => file.type === FileTypeEnum.POSTER);
  } else {
    moviePoster = parentMovie.files.find((file) => file.type === FileTypeEnum.POSTER);
  }

  if (movie.entity_type === SectionUserMovieTypeEnum.EPISODE && movie.episode) {
    movieFilm = movie.episode.files.find((file) => file.type === FileTypeEnum.FILM);
  } else {
    movieFilm = parentMovie.files.find((file) => file.type === FileTypeEnum.FILM);
  }
  const title = movie.entity_type === SectionUserMovieTypeEnum.MOVIE || !movie.episode ? parentMovie.title : `${dir === "rtl" ? `${t("RecentWatch.series")} ${parentMovie.title}` : `${parentMovie.title} ${t("RecentWatch.series")}`} - ${t("RecentWatch.season")} ${movie.episode.season_order ?? 1} - ${t("RecentWatch.episode")} ${movie.episode.order}`;
  const duration = Number(movieFilm?.duration);
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const progressTime = Number(movie.progress_time) || 0;
  const progressPercent = safeDuration > 0 ? Math.min(100, Math.max(0, (progressTime / safeDuration) * 100)) : 0;

  const placeholderPath = "/images/placeholder-h.jpg";

  return (
    <div className="relative rounded-md lg:rounded-xl overflow-hidden select-none h-40 xl:h-60">
      <Image src={moviePoster?.path || placeholderPath} alt={moviePoster?.alt_text || title} draggable={false} width={392} height={239} className="h-full object-top w-full object-cover bg-gray-11" />
      <div className="absolute rounded-b-md lg:rounded-b-xl bottom-0 left-0 bg-black/70 backdrop-blur-[15px] w-full z-10 flex flex-col gap-px p-2">
        <span className="text-white text-caption-sm lg:text-body-xxs">{title}</span>
        <div className="w-full flex items-center justify-between gap-4">
          <span className={`shrink-0 lg:text-caption-md text-caption-sm ${dir === "rtl" ? "order-1" : "order-3"}`}>{TimerParser(safeDuration, true)}</span>
          <Slider defaultValue={[progressPercent]} max={100} step={1} min={0} dir="ltr" disabled className="order-2" />
          <span className={`shrink-0 lg:text-caption-md text-caption-sm ${dir === "rtl" ? "order-3" : "order-1"}`}>{TimerParser(progressTime, true)}</span>
        </div>
      </div>
    </div>
  );
}

export default RecentWatchItemComp;
