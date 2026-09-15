"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import KidCardComp from "./kidsCard/kidsCard.index";
import { Autoplay, Pagination } from "swiper/modules";
import "./kids.style.css";
import Link from "next/link";
import { Button } from "../../../../utilities/components/ui";
import { ArrowLeft } from "iconsax-react";
import { useLocale } from "../../../../hooks";
import { SectionSelectionModeEnum, SectionType } from "../../../../types";

function KidsSectionComp({ section }: { section: SectionType }) {
  if (section.selection_mode === SectionSelectionModeEnum.USER_MOVIE) {
    return;
  }

  const [mounted, setMounted] = useState(false);
  const { dir, t } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="kids-section mt-8 lg:mt-12 lg:px-layout-x-space max-w-layout-max mx-auto">
      <h4 className="text-white text-mobile-h-4 lg:text-h-4 text-center">{section.title}</h4>
      <Swiper
        key={dir}
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        centeredSlides
        loop
        className={`w-full mt-6 lg:mt-8 rounded-xl transition-opacity duration-300  ${mounted ? "opacity-100" : "opacity-0"} [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-300  
        [&_.swiper-slide]:scale-[0.86]
        overflow-visible! overflow-x-clip!
    [&_.swiper-slide]:blur-[4px]
    [&_.swiper-slide]:opacity-70
    [&_.swiper-slide]:transition-all
    [&_.swiper-slide]:duration-300
    [&_.swiper-slide-active]:scale-100
    [&_.swiper-slide-active]:blur-none
    [&_.swiper-slide-active]:opacity-100
    [&_.swiper-slide-active>div]:shadow-[0_0_0px_10px_rgba(50,50,50,.15)]
    `}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
            spaceBetween: 16,
          },
          400: {
            slidesPerView: 1.7,
            spaceBetween: 16,
          },
          500: {
            slidesPerView: 2.3,
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
            slidesPerView: 4.2,
            spaceBetween: 5,
          },
        }}
      >
        {section.movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <KidCardComp movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center justify-between mt-[64px] lg:mt-[70px] gap-14 px-layout-x-space lg:px-0">
        <p className="hidden lg:block text-white text-body-xs truncate">{section.description}</p>
        <Link href={`/movies${section.filter || ""}`} className="w-full lg:w-fit">
          <Button className="flex items-center gap-2 whitespace-nowrap transition-all text-caption-md lg:text-body-xxs cursor-pointer rounded-md px-4 h-8 text-button-s w-full lg:w-fit">
            {t("Common.viewAll")} <ArrowLeft variant="Outline" className={`fill-white size-5 transition-all ${dir === "ltr" ? "rotate-180" : ""}`} />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default KidsSectionComp;
