"use client";
import SectionHeaderComp from "../sectionHeader/sectionHeader.index";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useState } from "react";
import MovieCardComp from "../../movie/movieCard/movieCard.index";
import { FreeMode } from "swiper/modules";

function NormalSliderSectionComp() {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateEdges = (swiper: { isBeginning: boolean; progress: number }) => {
    setIsBeginning(swiper.isBeginning && swiper.progress <= 0);
  };

  return (
    <section className="flex flex-col gap-4 lg:gap-6 mt-8 lg:mt-12 max-w-layout-max mx-auto">
      <SectionHeaderComp title="تازه های منتشر شده" address="/" />
      <div className="ps-layout-x-space relative">
        <div className={`absolute top-0 left-0 w-10 lg:w-28 z-10 h-full bg-[linear-gradient(-90deg,rgba(12,12,12,0)_0%,rgba(12,12,12,0.72)_50%,rgba(12,12,12,1)_100%)] transition-all ${isEnd ? "opacity-0 invisible" : ""}`}></div>
        <div className={`absolute top-0 right-layout-x-space w-10 lg:w-28 z-10 h-full bg-[linear-gradient(90deg,rgba(12,12,12,0)_0%,rgba(12,12,12,0.72)_50%,rgba(12,12,12,1)_100%)] transition-all ${isBeginning ? "opacity-0 invisible" : ""}`}></div>
        <Swiper
          freeMode={true}
          modules={[FreeMode]}
          observer={true}
          observeParents={true}
          className={`w-full rounded-md lg:rounded-xl pe-layout-x-space! transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
          breakpoints={{
            0: {
              slidesPerView: 1.82,
              spaceBetween: 16,
            },
            400: {
              slidesPerView: 2.15,
              spaceBetween: 16,
            },
            500: {
              slidesPerView: 2.5,
              spaceBetween: 16,
            },
            600: {
              slidesPerView: 2.9,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3.4,
              spaceBetween: 16,
            },
            900: {
              slidesPerView: 3.8,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 4.7,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 5.4,
              spaceBetween: 24,
            },
            1360: {
              slidesPerView: 5.1,
              spaceBetween: 24,
            },
            1536: {
              slidesPerView: 6.1,
              spaceBetween: 24,
            },
          }}
          onSwiper={(swiper) => {
            updateEdges(swiper);
          }}
          onSlideChange={(swiper) => {
            updateEdges(swiper);
          }}
          onProgress={(_, progress) => {
            setIsEnd(progress >= 1);
          }}
        >
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
          <SwiperSlide>
            <MovieCardComp />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}

export default NormalSliderSectionComp;
