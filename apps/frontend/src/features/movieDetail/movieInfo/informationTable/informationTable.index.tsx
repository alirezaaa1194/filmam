import Image from "next/image";
import { AppLanguagesEnum, MovieDetailPublicType, MovieTypeEnum } from "../../../../types";
import imdbIcon from "@/assets/icons/imdb.svg";
import { useLocale } from "../../../../hooks";

function MovieInformationTable({ movie }: { movie: MovieDetailPublicType }) {
  const { locale } = useLocale();
  return (
    <section className="px-layout-x-space w-full max-w-layout-max mx-auto">
      <h3 className="text-mobile-h-4 lg:text-h-5 text-white font-bold mb-4 lg:mb-6">اطلاعات {movie.type === MovieTypeEnum.SERIES ? "سریال" : "سینمایی"}</h3>

      <div className="bg-gray-13 border border-gray-11 rounded-xl lg:rounded-2xl p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4 lg:gap-x-8">
          {/* ژانر */}
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">ژانر</span>
            <div className="flex flex-wrap gap-1.5">
              {movie.genres?.map((genre) => (
                <span className="px-2.5 py-1 rounded-md bg-gray-11 text-white text-caption-md">{genre.name}</span>
              ))}
            </div>
          </div>

          {/* امتیاز */}
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">امتیاز</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white flex items-center gap-1">
              {movie.imdb_score} <Image src={imdbIcon} alt={`imdb-${movie.imdb_score}`} width={20} height={8} className="w-6 bg-[#f6c700]" />
            </span>
          </div>

          {/* تعداد فصل */}
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">تعداد فصل و قسمت</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">
              {movie.seasons_count} فصل - {movie.episodes_count} قسمت
            </span>
          </div>

          {/* سال انتشار */}
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">سال انتشار و کشور</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">
              {movie.released_year} ({movie.countries?.map((country) => country.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")})
            </span>
          </div>

          {/* زیرنویس */}
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">زیرنویس</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">{movie.languages?.map((language) => language.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")}</span>
          </div>

          {/* گروه سنی */}
          <div className="flex flex-col gap-1.5">
            <span className="text-mobile-caption-md lg:text-caption-md text-gray-8">گروه سنی</span>
            <span className="text-mobile-body-sm lg:text-body-xs text-white">بالای {movie.age_limit} سال</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieInformationTable;
