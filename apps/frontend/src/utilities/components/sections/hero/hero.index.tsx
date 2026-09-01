"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import pic1 from "@/assets/images/Image1.png";
import pic2 from "@/assets/images/Image2.png";
import pic3 from "@/assets/images/Image3.png";
import "./hero.style.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import { Add, ArchiveAdd, Play, VideoPlay } from "iconsax-react";
import Link from "next/link";
import HeroSectionContentComp from "./sectionContent/sectionContent.index";
import { Button } from "../../ui";

function HeroSectionComp() {
  return (
    <section>
      <Swiper
        slidesPerView={1}
        modules={[EffectFade, Pagination, Autoplay]}
        effect={"fade"}
        // autoplay={{
        //   delay: 5000,
        //   disableOnInteraction: false,
        // }}
        loop={true}
        pagination={{
          clickable: true,
        }}
      >
        <SwiperSlide className="select-none">
          <HeroSectionContentComp title="پوست شیر" description="داستان آن در مورد پدری است که در تلاش است تا عاملان ربوده شدن دخترش را پیدا کند.  هادی حجازی‌فر،  پانته‌آ بهرام،  مهرداد صدیقیان،  علیرضا کمالی،  پردیس احمدیه،  ژیلا شاهی  و  شهاب حسینی  از بازیگران این مجموعه هستند." options={["سریال", "درام", "جنایی"]} imageUrl={pic1}>
            <div className="flex gap-2 lg:gap-3">
              <Link href="/">
                <Button className="flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg!">
                  <Play variant="Outline" className="fill-white size-4 lg:size-6" />
                  مشاهده
                </Button>
              </Link>
              <Button className="hidden lg:flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg! bg-gray-11 hover:bg-gray-11/80">
                <VideoPlay variant="Outline" className="fill-white size-4 lg:size-6" />
                مشاهده تریلر
              </Button>
              <Button variant="outline" className="flex items-center px-0 lg:px-4 gap-2 lg:min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-gray-7 text-button-s! lg:text-button-xlg! border-transparent bg-none lg:border-gray-5! lg:hover:bg-gray-5/10">
                <Add variant="Outline" className="fill-gray-7 size-4 lg:size-6 hidden lg:block" />
                <ArchiveAdd variant="Outline" className="fill-white size-6 block lg:hidden" />
                <span className="hidden lg:block">اضافه به لیست علاقه مندی</span>
              </Button>
            </div>
          </HeroSectionContentComp>
        </SwiperSlide>
        <SwiperSlide className="select-none">
          <HeroSectionContentComp title="قورباغه" description="در روز چهارشنبه سوری ، سه دوست به نام‌های رامین (صابر ابر)، فرید (اشکان حسن پور) و جواد (شهروز دل افکار) بعد از ربودن اسلحهٔ یک مأمور زخمی، دست به سرقت از نوری (نوید محمدزاده)، همکلاسی دوران کودکی رامین که به فردی پولدار و مرموز تبدیل شده‌است می‌زنند، اما این اتفاق مسیر زندگی آن سه جوان را دستخوش تغییراتی می‌کند…" options={["سریال", "معمایی", "جنایی"]} imageUrl={pic2}>
            <div className="flex gap-2 lg:gap-3">
              <Link href="/">
                <Button className="flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg!">
                  <Play variant="Outline" className="fill-white size-4 lg:size-6" />
                  مشاهده
                </Button>
              </Link>
              <Button className="hidden lg:flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg! bg-gray-11 hover:bg-gray-11/80">
                <VideoPlay variant="Outline" className="fill-white size-4 lg:size-6" />
                مشاهده تریلر
              </Button>
              <Button variant="outline" className="flex items-center px-0 lg:px-4 gap-2 lg:min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-gray-7 text-button-s! lg:text-button-xlg! border-transparent bg-none lg:border-gray-5! lg:hover:bg-gray-5/10">
                <Add variant="Outline" className="fill-gray-7 size-4 lg:size-6 hidden lg:block" />
                <ArchiveAdd variant="Outline" className="fill-white size-6 block lg:hidden" />
                <span className="hidden lg:block">اضافه به لیست علاقه مندی</span>
              </Button>
            </div>
          </HeroSectionContentComp>
        </SwiperSlide>
        <SwiperSlide className="select-none">
          <HeroSectionContentComp title="زخم کاری" description="زخم کاری یک مجموعهٔ نمایش خانگی ایرانی در ژانر درام جنایی به نویسندگی و کارگردانی محمدحسین مهدویان است.فصل دوم این سریال با نگاهی به نمایشنامه هملت نوشته ویلیام شکسپیر و طراحی قصه محمدحسین مهدویان نوشته شده است." options={["سریال", "درام", "جنایی"]} imageUrl={pic3}>
            <div className="flex gap-2 lg:gap-3">
              <Link href="/">
                <Button className="flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg!">
                  <Play variant="Outline" className="fill-white size-4 lg:size-6" />
                  مشاهده
                </Button>
              </Link>
              <Button className="hidden lg:flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg! bg-gray-11 hover:bg-gray-11/80">
                <VideoPlay variant="Outline" className="fill-white size-4 lg:size-6" />
                مشاهده تریلر
              </Button>
              <Button variant="outline" className="flex items-center px-0 lg:px-4 gap-2 lg:min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-gray-7 text-button-s! lg:text-button-xlg! border-transparent bg-none lg:border-gray-5! lg:hover:bg-gray-5/10">
                <Add variant="Outline" className="fill-gray-7 size-4 lg:size-6 hidden lg:block" />
                <ArchiveAdd variant="Outline" className="fill-white size-6 block lg:hidden" />
                <span className="hidden lg:block">اضافه به لیست علاقه مندی</span>
              </Button>
            </div>
          </HeroSectionContentComp>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default HeroSectionComp;
