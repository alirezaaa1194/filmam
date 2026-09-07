"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCardComp from "../../movie/movieCard/movieCard.index";
import { useEffect, useState } from "react";

function KidsSectionComp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="mt-8 lg:mt-12 px-layout-x-space">
      <h4 className="text-white text-mobile-h-4 lg:text-h-4 text-center">دنیایی متنوع از انیمیشن های جذاب</h4>
      <Swiper
        centeredSlides={true}
        observer={true}
        observeParents={true}
        loop
        className={`w-full mt-6 lg:mt-8 rounded-md lg:rounded-xl transition-opacity duration-300 overflow-clip! ${mounted ? "opacity-100" : "opacity-0"} [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-300  [&_.swiper-slide]:scale-[0.9]
    [&_.swiper-slide]:blur-[4px]
    [&_.swiper-slide]:opacity-50
    [&_.swiper-slide]:transition-all
    [&_.swiper-slide]:duration-300
    [&_.swiper-slide-active]:scale-100
    [&_.swiper-slide-active]:blur-none
    [&_.swiper-slide-active]:opacity-100
    [&_.swiper-slide-active>div]:shadow-[0_0_0px_10px_rgba(50,50,50,.15)]
    `}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
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
            slidesPerView: 5,
            spaceBetween: 24,
          },
        //   1200: {
        //     slidesPerView: 7,
        //     spaceBetween: 24,
        //   },
        //   1280: {
        //     slidesPerView: 9,
        //     spaceBetween: 24,
        //   },
        //   1360: {
        //     slidesPerView: 11,
        //     spaceBetween: 24,
        //   },
        //   1536: {
        //     slidesPerView: 13,
        //     spaceBetween: 24,
        //   },
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
    </section>
  );
}

export default KidsSectionComp;
