import Image from "next/image";
import { AppLanguagesEnum, FileTypeEnum, MovieDetailPublicType, MovieTypeEnum } from "../../../../types";
import imdbIcon from "@/assets/icons/imdb.svg";

import { useLocale } from "../../../../hooks";
import { movieLikePercentCalc } from "../../../../lib/utils";

function MovieInformationTable({ movie }: { movie: MovieDetailPublicType }) {
  const { locale, dir } = useLocale();
  const filmFile = movie.files.find((file) => file.type === FileTypeEnum.FILM);
  return (
    <section className="px-layout-x-space w-full max-w-layout-max mx-auto">
      <h3 className="text-white text-mobile-h-5 lg:text-h-5 mb-2 lg:mb-4">اطلاعات {movie.type === MovieTypeEnum.SERIES ? "سریال" : "سینمایی"}</h3>

      <div className="bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4 lg:gap-x-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">ژانر</span>
            <div className="flex flex-wrap gap-1.5">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="px-2.5 py-1 rounded-md bg-gray-11 text-white text-caption-md">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">امتیاز</span>
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
              <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">تعداد فصل و قسمت</span>
              <span className="text-mobile-body-sm lg:text-body-xs text-white">
                {movie.seasons_count} فصل - {movie.episodes_count} قسمت
              </span>
            </div>
          ) : filmFile && Number(filmFile.duration) > 0 ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">مدت زمان</span>
              <span className="text-mobile-body-sm lg:text-body-xs text-white">{Math.floor(Number(filmFile.duration || 0) / 60)} دقیقه</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">سال انتشار و کشور</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">
              {movie.released_year} ({movie.countries?.map((country) => country.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")})
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">زبان</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">{movie.languages?.map((language) => language.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">گروه سنی</span>
            <span className={`text-mobile-body-sm lg:text-body-xs text-white ${dir === "rtl" ? "text-right" : "text-left"}`} dir="ltr">
              +{movie.age_limit}
            </span>
          </div>
          {movie.languages?.some((lang) => lang.code.toUpperCase() !== "FA") ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">ترجمه</span>
              <span className="text-mobile-body-sm lg:text-body-xs text-white">{movie.has_dub ? "دارد" : "ندارد"}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default MovieInformationTable;
