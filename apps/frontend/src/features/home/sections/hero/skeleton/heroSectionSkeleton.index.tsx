"use client";

import { Skeleton } from "../../../../../utilities/components/ui";

function HeroSectionSkeletonComp() {
  return (
    <section className="hero-section relative h-[420px] md:h-[624px] 2xl:h-screen w-full overflow-hidden">
      {/* تصویر هیرو — z-10 */}
      <Skeleton className="absolute z-10 top-0 left-0 w-full h-full object-cover object-top bg-gray-11 rounded-none" />

      {/* گرادیان تیره روی تصویر — z-20 */}
      <div className="absolute z-20 top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0.96)_13%,rgba(12,12,12,0.4)_33%,rgba(12,12,12,0)_47%,rgba(12,12,12,0.28)_68%,rgba(12,12,12,1)_100%)]" />

      {/* محتوای روی تصویر — z-30 */}
      <div className="absolute z-30 top-0 left-0 w-full h-full max-w-layout-max right-0 mx-auto flex flex-col justify-end gap-4 lg:gap-8 items-start px-layout-x-space py-8 lg:py-6">
        {/* w-full اضافه شد تا موبایل پر بشه — دقیقاً مثل نسخه‌ی اصلی */}
        <div className="w-full flex flex-col gap-2 lg:gap-4 md:max-w-[393px]">
          {/* تایتل: text-mobile-h-3 md:text-display-2 */}
          <Skeleton className="h-7 md:h-[52px] w-full max-w-[150px] md:max-w-[240px] bg-gray-11" />

          {/* توضیحات موبایل: text-mobile-caption-md line-clamp-2 md:hidden */}
          <div className="flex flex-col gap-1.5 w-full md:hidden">
            <Skeleton className="h-3.5 w-full bg-gray-11" />
            <Skeleton className="h-3.5 w-[75%] bg-gray-11" />
          </div>

          {/* بج‌ها: hidden xl:flex flex-wrap gap-2 */}
          <div className="hidden xl:flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20 rounded-md bg-gray-11" />
            <Skeleton className="h-7 w-16 rounded-md bg-gray-11" />
            <Skeleton className="h-7 w-14 rounded-md bg-gray-11" />
            <Skeleton className="h-7 w-16 rounded-md bg-gray-11" />
          </div>

          {/* توضیحات دسکتاپ: hidden md:block line-clamp-6 */}
          <div className="hidden md:flex flex-col gap-2 w-full">
            <Skeleton className="h-4 w-full bg-gray-11" />
            <Skeleton className="h-4 w-full bg-gray-11" />
            <Skeleton className="h-4 w-full bg-gray-11" />
            <Skeleton className="h-4 w-full bg-gray-11" />
            <Skeleton className="h-4 w-full bg-gray-11" />
            <Skeleton className="h-4 w-[65%] bg-gray-11" />
          </div>
        </div>

        {/* دکمه‌ی پلی — فقط play طبق MovieFunctionalitiesComp */}
        <div className="w-full lg:w-fit">
          <Skeleton className="h-[46px] w-full lg:w-40 rounded-md bg-gray-11" />
        </div>
      </div>

      {/* پجینیشن — z-40، bottom مثبت تا داخل سکشن بمونه */}
      <div className="absolute z-40 flex items-center gap-2 w-fit! start-0! end-0! mx-auto! lg:start-auto! lg:end-[108px]! bottom-2! lg:bottom-[52px]!">
        <Skeleton className="size-2 lg:size-4 rounded-full bg-gray-11" />
        <Skeleton className="size-2 lg:size-4 rounded-full bg-gray-11" />
        <Skeleton className="size-2 lg:size-4 rounded-full bg-gray-11" />
      </div>
    </section>
  );
}

export default HeroSectionSkeletonComp;