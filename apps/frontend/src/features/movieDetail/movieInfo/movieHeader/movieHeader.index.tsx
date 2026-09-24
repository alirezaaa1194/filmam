import Image from "next/image";
import { AppLanguagesEnum, FileTypeEnum, MovieDetailPublicType, MovieTypeEnum, RoleTypeEnum } from "../../../../types";
import { useLocale } from "../../../../hooks";
import MovieCardComp from "../../../../utilities/components/movie/movieCard/movieCard.index";
import MovieFunctionalitiesComp from "../../../../utilities/components/movie/movieFunctionalities/movieFunctionalities.index";
import imdbIcon from "@/assets/icons/imdb.svg";

function MovieHeaderComp({ movie }: { movie: MovieDetailPublicType }) {
  const bannerUrl = movie.files.find((file) => file.type === FileTypeEnum.BANNER);
  const placeholderPath = "/images/placeholder-h.jpg";
  const movieDirector = movie.factors?.find((factor) => factor.role.type === RoleTypeEnum.DIRECTOR);
  const { t, locale } = useLocale();
  const filmFile = movie.files.find((file) => file.type === FileTypeEnum.FILM);

  return (
    <section className="relative md:h-[624px] 2xl:h-screen">
      <Image src={bannerUrl?.path || placeholderPath} alt={bannerUrl?.alt_text || movie.title} className="w-full h-[300px] md:h-full object-cover object-top bg-gray-11" width={800} height={240} />
      <div className="absolute z-10 top-0 left-0 w-full h-[300px] md:h-full bg-[linear-gradient(0deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0.96)_13%,rgba(12,12,12,0.4)_33%,rgba(12,12,12,0)_47%,rgba(12,12,12,0.28)_68%,rgba(12,12,12,1)_100%)]" />
      <div className="hidden md:block absolute z-10 top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0)_28%,rgba(12,12,12,0.55)_52%,rgba(12,12,12,1)_100%)]" />

      <div className="lg:absolute z-20 top-0 left-0 right-0 w-full max-w-layout-max mx-auto flex gap-12 lg:h-full px-layout-x-space pb-10 xl:pb-5">
        <div className="w-fit h-fit self-end py-8 lg:py-6 hidden xl:block">
          <MovieCardComp movie={movie} />
        </div>

        <div className="w-full min-w-0 h-full flex flex-col justify-end gap-2 lg:gap-8 items-start lg:py-6">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-mobile-h-3 md:text-display-2 truncate max-w-full">{movie.title}</h1>
            <div className="hidden xl:flex flex-wrap gap-2">
              <span className="flex items-center justify-center px-2 text-body-xs text-white border border-gray-10 bg-[#2f2f2f]/40 rounded-md">{movie.type === MovieTypeEnum.SERIES ? t("Movie.Series") : t("Movie.Cinematic")}</span>
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="flex items-center justify-center px-2 text-body-xs text-white border border-gray-10 bg-[#2f2f2f]/40 rounded-md">
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="w-full min-w-0 flex justify-between lg:justify-start gap-4 lg:gap-10 text-nowrap overflow-x-auto scrollbar-none text-caption-md lg:text-body-xxs my-3">
              {movieDirector ? (
                <span className="text-caption-md lg:text-body-xxs shrink-0">
                  {t("MovieDetailPage.director")}: {movieDirector.first_name} {movieDirector.last_name}
                </span>
              ) : null}

              {movie.type === MovieTypeEnum.SERIES && movie.seasons_count && movie.episodes_count ? (
                <span className="shrink-0">
                  {movie.seasons_count} {t("RecentWatch.season")} ({movie.episodes_count} {t("RecentWatch.episode")})
                </span>
              ) : movie.type !== MovieTypeEnum.SERIES && filmFile ? (
                <span className="shrink-0">{filmFile.duration} دقیقه</span>
              ) : null}

              {movie.genres?.length ? <span className="flex xl:hidden shrink-0">{movie.genres.map((genre) => genre.name).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")}</span> : null}

              {movie.released_year ? (
                <span className="shrink-0">
                  {movie.released_year} ({movie.countries?.map((country) => country.label).join(locale === AppLanguagesEnum.FA || locale === AppLanguagesEnum.AR ? "، " : ", ")})
                </span>
              ) : null}

              {movie.imdb_score ? (
                <span className="flex items-center gap-1 shrink-0">
                  {movie.imdb_score}
                  <Image src={imdbIcon} alt="imdb" width={20} height={8} className="w-6 bg-[#f6c700]" />
                </span>
              ) : null}

              {movie.age_limit ? (
                <span dir="ltr" className="shrink-0">
                  +{movie.age_limit}
                </span>
              ) : null}
            </div>

            <p className="hidden md:block text-justify text-body-xs md:line-clamp-2! min-w-0 md:max-w-[393px]">{movie.short_description}</p>
          </div>

          <MovieFunctionalitiesComp movie={movie} play={{ title: t("Hero.watch") }} trailer={true} />
        </div>
      </div>
    </section>
  );
}

export default MovieHeaderComp;
