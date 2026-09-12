"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "./hero.style.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import HeroSectionContentComp from "./sectionContent/sectionContent.index";
import { useLocale } from "../../../../hooks";
import { FileTypeEnum, SectionSelectionModeEnum, SectionType } from "../../../../types";
import HeroContentOptionsComp from "./sectionContent/options/options.index";

function HeroSectionComp({ section }: { section: SectionType }) {
  if (section.selection_mode === SectionSelectionModeEnum.USER_MOVIE) {
    return;
  }

  const { dir } = useLocale();

  return (
    <section className="hero-section min-h-[240px]!">
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
        className="!min-h-[240px] [&_.swiper-wrapper]:!min-h-[240px] [&_.swiper-slide]:!min-h-[240px]"
      >
        {section.movies.map((movie) => (
          <SwiperSlide key={movie.id} className="select-none">
            <HeroSectionContentComp title={movie.title} description={movie.short_description} options={movie.genres?.map((genre) => genre.name) || []} imageUrl={movie.files.find((file) => file.type === FileTypeEnum.POSTER)?.path || ""}>
              <HeroContentOptionsComp />
            </HeroSectionContentComp>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSectionComp;
