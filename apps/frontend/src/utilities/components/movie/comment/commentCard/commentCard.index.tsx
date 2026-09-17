import Image from "next/image";
import userPlaceholder from "@/assets/images/userPlaceholder.webp";
import { Dislike, Like1 } from "iconsax-react";

function CommentCardComp() {
  return (
    <div className="flex flex-col p-4 bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={userPlaceholder} alt="" width={16} height={16} className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-primary text-h-6">علی محمدی</span>
            <span className="text-mobile-caption-md text-gray-9">2026/03/18 12:45</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="text-gray-9">12</span>
            <button className="cursor-pointer hover:[&>svg]:fill-primary">
              <Like1 variant="Outline" className="fill-gray-9 size-4 lg:size-6 transition-all" />
            </button>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-gray-9">12</span>
            <button className="cursor-pointer hover:[&>svg]:fill-complementary">
              <Dislike variant="Outline" className="fill-gray-9 size-4 lg:size-6 transition-all" />
            </button>
          </span>
        </div>
      </div>
      <p className="ps-0 lg:ps-[52px] text-gray-6 text-caption-lg">واییییی واقعا تمام خنده دار بودن زیبا بودن فیلم رو مهران غفوریان اجرا کرد ولی پوریا پورسرخ هم خوب بود من خودم به شخصه خیلی از اجرای مهران غفوریان خوشم اومد واییییی واقعا تمام خنده دار بودن زیبا بودن فیلم رو مهران غفوریان اجرا کرد ولی پوریا پورسرخ هم خوب بود من خودم به شخصه خیلی از اجرای مهران غفوریان خوشم اومد واییییی واقعا تمام خنده دار بودن زیبا بودن فیلم رو مهران غفوریان اجرا کرد ولی پوریا پورسرخ هم خوب بود من خودم به شخصه خیلی از اجرای مهران غفوریان خوشم اومد</p>
    </div>
  );
}

export default CommentCardComp;
