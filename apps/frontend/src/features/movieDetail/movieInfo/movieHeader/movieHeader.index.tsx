import Image from "next/image";
import { FileTypeEnum, MovieDetailPublicType, MovieTypeEnum, RoleTypeEnum } from "../../../../types";
import { useLocale } from "../../../../hooks";
import { Button } from "../../../../utilities/components/ui";
import { Add, ArchiveAdd } from "iconsax-react";
import MovieCardComp from "../../../../utilities/components/movie/movieCard/movieCard.index";

function MovieHeaderComp({ movie }: { movie: MovieDetailPublicType }) {
  const bannerUrl = movie.files.find((file) => file.type === FileTypeEnum.BANNER);
  const placeholderPath = "/images/placeholder-h.jpg";
  const movieDirector = movie.factors?.find((factor) => factor.role.type === RoleTypeEnum.DIRECTOR);
  const { t } = useLocale();

  return (
    <section className="relative h-[240px] md:h-[624px] 2xl:h-screen">
      <div className="absolute z-10 top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0.96)_13%,rgba(12,12,12,0.4)_33%,rgba(12,12,12,0)_47%,rgba(12,12,12,0.28)_68%,rgba(12,12,12,1)_100%)]" />
      <div className="absolute z-20 top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0)_28%,rgba(12,12,12,0.55)_52%,rgba(12,12,12,1)_100%)] flex gap-12 px-layout-x-space pb-10 xl:pb-5">
        <div className="w-fit h-fit self-end py-8 lg:py-6 hidden xl:block">
          <MovieCardComp movie={movie} />
        </div>
        <div className="w-full h-full flex flex-col justify-end gap-2 lg:gap-8 items-start lg:py-6">
          <div className="flex flex-col gap-2 md:max-w-[393px]">
            <h2 className="text-mobile-h-3 md:text-display-2 text-nowrap">{movie.title}</h2>
            <div className="hidden xl:flex flex-wrap gap-2">
              <span className="flex items-center justify-center px-2 text-body-xs text-white border border-gray-10 bg-[#2f2f2f]/40 rounded-md">{movie.type === MovieTypeEnum.SERIES ? t("Movie.Series") : t("Movie.Cinematic")}</span>
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="flex items-center justify-center px-2 text-body-xs text-white border border-gray-10 bg-[#2f2f2f]/40 rounded-md">
                  {genre.name}
                </span>
              ))}
            </div>
            {movieDirector ? (
              <p className="hidden md:block text-justify text-body-xs mt-4 mb-1">
                {t("MovieDetailPage.director")}: {movieDirector.first_name} {movieDirector.last_name}
              </p>
            ) : null}
            <p className="hidden md:block text-justify text-body-xs md:line-clamp-4!">{movie.short_description}</p>
          </div>
          <Button variant="outline" className="flex self-end lg:self-start items-center px-0 lg:px-4 gap-2 lg:min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-gray-7 text-button-s! lg:text-button-xlg! border-transparent bg-none lg:border-gray-5! lg:hover:bg-gray-5/10">
            <Add variant="Outline" className="fill-gray-7 size-4 lg:size-6 hidden lg:block" />
            <ArchiveAdd variant="Outline" className="fill-white size-6 block lg:hidden" />
            <span className="hidden lg:block">{t("Hero.addToWishlist")}</span>
          </Button>
        </div>
      </div>
      <Image src={bannerUrl?.path || placeholderPath} alt={bannerUrl?.alt_text || movie.title} className="w-full h-full object-cover object-top bg-gray-11" width={800} height={240} />
    </section>
  );
}

export default MovieHeaderComp;
