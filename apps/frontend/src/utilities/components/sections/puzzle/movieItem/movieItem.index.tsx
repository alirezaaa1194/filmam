import { Heart, Stickynote, UserSquare, VideoPlay } from "iconsax-react";
import Image from "next/image";
import pic from "@/assets/images/image4.webp";

function PuzzleMovieItemComp() {
  return (
    <div className="h-max w-fit flex gap-3">
      <Image src={pic} alt="test" className="h-auto self-stretch lg:max-w-[105px] object-cover rounded-xl border border-gray-10" />
      <div className="hidden lg:flex flex-col justify-center gap-3">
        <h5 className="text-white text-h-5">تی ان تی</h5>
        <span className="text-gray-8 flex items-center gap-1">
          <UserSquare className="size-6 fill-gray-8 shrink-0" variant="Bold" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">حامد آهنگی</span>
        </span>
        <span className="text-gray-8 flex items-center gap-1">
          <Stickynote className="size-6 fill-gray-8 shrink-0" variant="Outline" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">مسابقه - رئالیتی شو</span>
        </span>
        <span className="text-gray-8 flex items-center gap-1">
          <Heart className="size-6 fill-gray-8 shrink-0" variant="Outline" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">94%</span>
        </span>
        <span className="text-gray-8 flex items-center gap-1">
          <VideoPlay className="size-6 fill-gray-8 shrink-0" variant="Outline" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">23 قسمت</span>
        </span>
      </div>
    </div>
  );
}

export default PuzzleMovieItemComp;
