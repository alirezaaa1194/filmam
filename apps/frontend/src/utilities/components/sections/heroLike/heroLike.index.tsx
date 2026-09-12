"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "../hero/hero.style.css";
import "swiper/css";
import "swiper/css/effect-fade";

import { EffectFade, Autoplay } from "swiper/modules";
import HeroSectionContentComp from "../hero/sectionContent/sectionContent.index";
import SectionHeaderComp from "../sectionHeader/sectionHeader.index";
import { useLocale } from "../../../../hooks";
import { FileTypeEnum, SectionSelectionModeEnum, SectionType } from "../../../../types";
import HeroLikeContentOptionsComp from "./options/options.index";

function HeroLikeSectionComp({ section }: { section: SectionType }) {
  if (section.selection_mode === SectionSelectionModeEnum.USER_MOVIE) {
    return;
  }

  const { dir } = useLocale();

  return (
    <section className="min-h-[240px]! mt-8 lg:mt-12 relative">
      <SectionHeaderComp title={section.title} address={`/movies${section.filter||''}`} absolute />
      <Swiper
        key={dir}
        slidesPerView={1}
        modules={[EffectFade, Autoplay]}
        effect={"fade"}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="!min-h-[240px] [&_.swiper-wrapper]:!min-h-[240px] [&_.swiper-slide]:!min-h-[240px]"
      >
        {section.movies.map((movie) => (
          <SwiperSlide className="select-none" key={movie.id}>
            <HeroSectionContentComp title={movie.title} description={movie.short_description} options={movie.genres?.map((genre) => genre.name) || []} imageUrl={movie.files.find((file) => file.type === FileTypeEnum.POSTER)?.path || ""}>
              <HeroLikeContentOptionsComp />
            </HeroSectionContentComp>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroLikeSectionComp;
