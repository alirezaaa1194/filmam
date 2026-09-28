import { Like1 } from "iconsax-react";
import { movieLikePercentCalc } from "../../../../../lib/utils";
import { AppLanguagesEnum, FileTypeEnum, MovieDetailPublicType, MovieTypeEnum, RoleTypeEnum } from "../../../../../types";
import Image from "next/image";
import imdbIcon from "@/assets/icons/imdb.svg";
import { useLocale } from "../../../../../hooks";

function MovieHeaderMetaDataComp({ movie }: { movie: MovieDetailPublicType }) {
  const { locale, t } = useLocale();
  const movieDirector = movie.factors?.find((factor) => factor.role.type === RoleTypeEnum.DIRECTOR);
  const filmFile = movie.files.find((file) => file.type === FileTypeEnum.FILM);

  return (
    <div className="w-full min-w-0 pb-2 flex justify-between lg:justify-start gap-4 lg:gap-10 text-nowrap overflow-x-auto lg:scrollbar-none text-caption-md lg:text-body-xxs mb-2">
      {movieDirector ? (
        <span className="text-caption-md lg:text-body-xxs shrink-0">
          {t("MovieDetailPage.director")}: {movieDirector.first_name} {movieDirector.last_name}
        </span>
      ) : null}
      {movie.type === MovieTypeEnum.SERIES && movie.seasons_count && movie.episodes_count ? (
        <span className="shrink-0">
          {movie.seasons_count} {t("RecentWatch.season")} ({movie.episodes_count} {t("RecentWatch.episode")})
        </span>
      ) : movie.type !== MovieTypeEnum.SERIES && filmFile && filmFile.duration ? (
        <span className="shrink-0">{Math.floor(Number(filmFile.duration || 0) / 60)} دقیقه</span>
      ) : null}
      {movie.genres?.length ? <span className="flex xl:hidden shrink-0">{movie.genres.map((genre) => genre.name).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")}</span> : null}
      {movie.released_year ? (
        <span className="shrink-0">
          {movie.released_year} ({movie.countries?.map((country) => country.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")})
        </span>
      ) : null}
      {Number(movieLikePercentCalc(movie.likes_count, movie.dislikes_count)) ? (
        <span className="flex items-center gap-1 shrink-0">
          {movieLikePercentCalc(movie.likes_count, movie.dislikes_count)}%
          <Like1 variant="Outline" className="size-4 fill-white" />
        </span>
      ) : null}
      {movie.imdb_score ? (
        <span className="flex items-center gap-1 shrink-0">
          {movie.imdb_score}
          <Image src={imdbIcon} alt={`imdb-${movie.imdb_score}`} width={20} height={8} className="w-6 bg-[#f6c700]" />
        </span>
      ) : null}
      {movie.age_limit ? (
        <span dir="ltr" className="shrink-0">
          +{movie.age_limit}
        </span>
      ) : null}
    </div>
  );
}

export default MovieHeaderMetaDataComp;
