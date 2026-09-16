"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "./hero.style.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import HeroSectionContentComp from "./sectionContent/sectionContent.index";
import { useLocale } from "../../../../hooks";
import { FileTypeEnum, MovieTypeEnum, SectionSelectionModeEnum, SectionType } from "../../../../types";
import MovieFunctionalitiesComp from "../../../../utilities/components/movie/movieFunctionalities/movieFunctionalities.index";

function HeroSectionComp({ section }: { section: SectionType }) {
  if (section.selection_mode === SectionSelectionModeEnum.USER_MOVIE) {
    return;
  }

  const { dir, t } = useLocale();

  return (
    <section className="hero-section h-[240px] md:h-[624px] 2xl:h-screen">
      <Swiper
        key={dir}
        slidesPerView={1}
        modules={[EffectFade, Pagination, Autoplay]}
        effect={"fade"}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        className="h-full"
      >
        {section.movies.map((movie) => (
          <SwiperSlide key={movie.id} className="select-none">
            <HeroSectionContentComp title={movie.title} description={movie.short_description} options={[movie.type === MovieTypeEnum.SERIES ? t("Movie.Series") : t("Movie.Cinematic"), ...(movie.genres?.map((genre) => genre.name) || [])]} imageUrl={movie.files.find((file) => file.type === FileTypeEnum.POSTER)?.path}>
              <MovieFunctionalitiesComp movieId={movie.id} notification={false} dislike={false} />
            </HeroSectionContentComp>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSectionComp;
