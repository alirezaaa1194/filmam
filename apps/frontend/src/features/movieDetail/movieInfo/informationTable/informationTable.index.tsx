import Image from "next/image";
import { AppLanguagesEnum, FileTypeEnum, MovieDetailPublicType, MovieTypeEnum } from "../../../../types";
import imdbIcon from "@/assets/icons/imdb.svg";

import { useLocale } from "../../../../hooks";
import { movieLikePercentCalc } from "../../../../lib/utils";

function MovieInformationTable({ movie }: { movie: MovieDetailPublicType }) {
  const { locale, dir, t } = useLocale();
  const filmFile = movie.files.find((file) => file.type === FileTypeEnum.FILM);
  const [detailsPrefix = "", detailsSuffix = ""] = t("MovieDetailPage.detailsTitle").split("--");
  const movieTypeTitle = movie.type === MovieTypeEnum.SERIES ? t("MovieDetail.series") : t("MovieDetail.movie");
  return (
    <section className="px-layout-x-space w-full max-w-layout-max mx-auto">
      <h3 dir={dir} className="mb-2 text-white text-mobile-h-5 lg:mb-4 lg:text-h-5"><span>{detailsPrefix}</span><bdi dir="auto">{movieTypeTitle}</bdi><span>{detailsSuffix}</span></h3>

      <div className="bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4 lg:gap-x-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.genre")}</span>
            <div className="flex flex-wrap gap-1.5">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="px-2.5 py-1 rounded-md bg-gray-11 text-white text-caption-md">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.score")}</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white flex items-center gap-5">
              <span className="flex items-center gap-1">
                {movieLikePercentCalc(movie.likes_count, movie.dislikes_count)}% <Image src="/logo.svg" alt="filmam" width={20} height={8} className="w-6" />
              </span>
              <span className="flex items-center gap-1">
                {movie.imdb_score} <Image src={imdbIcon} alt={`imdb-${movie.imdb_score}`} width={20} height={8} className="w-6 bg-[#f6c700]" />
              </span>
            </span>
          </div>

          {movie.type === MovieTypeEnum.SERIES ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.seasonsEpisodes")}</span>
              <span className="text-mobile-body-sm lg:text-body-xs text-white">
                {movie.seasons_count} {t("MovieDetail.seasonCount")} - {movie.episodes_count} {t("MovieDetail.episodeCount")}
              </span>
            </div>
          ) : filmFile && Number(filmFile.duration) > 0 ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.duration")}</span>
              <span className="text-mobile-body-sm lg:text-body-xs text-white">{Math.floor(Number(filmFile.duration || 0) / 60)} {t("MovieDetail.minutes")}</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.releaseCountry")}</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">
              {movie.released_year} ({movie.countries?.map((country) => country.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")})
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.language")}</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">{movie.languages?.map((language) => language.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.ageRating")}</span>
            <span className={`text-mobile-body-sm lg:text-body-xs text-white ${dir === "rtl" ? "text-right" : "text-left"}`} dir="ltr">
              +{movie.age_limit}
            </span>
          </div>
          {movie.languages?.some((lang) => lang.code.toUpperCase() !== "FA") ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">{t("MovieDetail.subtitles")}</span>
              <span className="text-mobile-body-sm lg:text-body-xs text-white">{movie.has_dub ? t("MovieDetail.yes") : t("MovieDetail.no")}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default MovieInformationTable;
