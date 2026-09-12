"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useLocale, useMediaQuery } from "../../../../hooks";
import "./puzzle.style.css";
import PuzzleSliderItemComp from "./sliderItem/sliderItem.index";
import PuzzleMovieItemComp from "./movieItem/movieItem.index";
import { PuzzleSectionMovieViewModeEnum, SectionSelectionModeEnum, SectionType } from "../../../../types";

function PuzzleSectionComp({ section }: { section: SectionType }) {
  if (section.selection_mode === SectionSelectionModeEnum.USER_MOVIE) {
    return;
  }

  const [mounted, setMounted] = useState(false);
  const { dir } = useLocale();
  const isXl = useMediaQuery("(min-width: 1280px)");

  const sliderItems = isXl ? section.movies.filter((movie) => movie.view_mode === PuzzleSectionMovieViewModeEnum.SLIDER_ITEM) : section.movies;
  const puzzleItems = section.movies.filter((movie) => movie.view_mode === PuzzleSectionMovieViewModeEnum.PUZZLE);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="puzzle-section max-w-layout-max mx-auto mt-20 px-layout-x-space flex flex-col gap-2 lg:gap-4">
      <h5 className="text-primary text-mobile-h-6 lg:text-h-5">{section.title}</h5>
      <div className="flex flex-col xl:flex-row items-stretch gap-6">
        <div className="w-full xl:max-w-[665px] rounded-xl border border-gray-10 overflow-hidden">
          <Swiper
            effect={"fade"}
            className={`relative h-full! ${mounted ? "opacity-100" : "opacity-0"}`}
            key={dir}
            slidesPerView={1}
            modules={[EffectFade, Pagination, Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            loop
          >
            {sliderItems.map((movie) => (
              <SwiperSlide key={movie.id} className="h-[350px]! xl:h-full!">
                <PuzzleSliderItemComp movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full h-full xl:max-w-[535px] hidden xl:grid grid-cols-2 gap-y-3 lg:gap-y-6 gap-x-3">
          {puzzleItems.map((movie) => (
            <PuzzleMovieItemComp key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PuzzleSectionComp;
