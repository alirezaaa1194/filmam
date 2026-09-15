"use client";
import SectionHeaderComp from "../sectionHeader/sectionHeader.index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import RecentWatchItemComp from "./recentWatchItem/recentWatchItem.index";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode } from "swiper/modules";
import { useLocale } from "../../../../hooks";
import { SectionSelectionModeEnum, SectionType } from "../../../../types";

function RecentWatchSectionComp({ section }: { section: SectionType }) {
  if (section.selection_mode !== SectionSelectionModeEnum.USER_MOVIE) {
    return;
  }

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const { dir } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateEdges = (swiper: { isBeginning: boolean; progress: number }) => {
    setIsBeginning(swiper.isBeginning && swiper.progress <= 0);
  };

  return (
    <section className="flex flex-col gap-4 lg:gap-6 mt-4 lg:mt-6 max-w-layout-max mx-auto">
      <SectionHeaderComp title={section.title} address="/" />
      <div className="relative">
        <div className={`absolute top-0 left-0 w-10 lg:w-28 z-10 h-full bg-[linear-gradient(-90deg,rgba(12,12,12,0)_0%,rgba(12,12,12,0.72)_50%,rgba(12,12,12,1)_100%)] transition-all ${isEnd ? "opacity-0 invisible" : ""}`}></div>
        <div className={`absolute top-0 right-0 w-10 lg:w-28 z-10 h-full bg-[linear-gradient(90deg,rgba(12,12,12,0)_0%,rgba(12,12,12,0.72)_50%,rgba(12,12,12,1)_100%)] transition-all ${isBeginning ? "opacity-0 invisible" : ""}`}></div>
        <Swiper
          key={dir}
          freeMode={true}
          modules={[FreeMode]}
          observer={true}
          observeParents={true}
          className={`w-full px-layout-x-space! transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
          slidesPerView={1.2}
          spaceBetween={8}
          breakpoints={{
            0: {
              slidesPerView: 1.25,
              spaceBetween: 16,
            },
            400: {
              slidesPerView: 1.45,
              spaceBetween: 16,
            },
            500: {
              slidesPerView: 1.55,
              spaceBetween: 16,
            },
            600: {
              slidesPerView: 2.1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            900: {
              slidesPerView: 2.9,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
            1100: {
              slidesPerView: 2.4,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 2.6,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 3.1,
              spaceBetween: 24,
            },
            1536: {
              slidesPerView: 3.9,
              spaceBetween: 24,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateEdges(swiper);
          }}
          onSlideChange={(swiper) => {
            updateEdges(swiper);
          }}
          onProgress={(_, progress) => {
            setIsEnd(progress >= 1);
          }}
        >
          {section.movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <RecentWatchItemComp movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default RecentWatchSectionComp;
