import pic4 from "@/assets/images/image4.webp";
import { Heart } from "iconsax-react";
import Image from "next/image";

function MovieCardComp() {
  return (
    <div className="relative rounded-md lg:rounded-xl overflow-hidden select-none h-[300px] xl:h-[370px]">
      <span className="absolute top-[6px] start-[6px] text-white text-caption-sm lg:text-caption-md px-2 bg-black/30 backdrop-blur-[5px] rounded-md">سریال</span>
      <Image draggable={false} src={pic4} alt="test" className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-black/30 backdrop-blur-[10px] flex items-center justify-center xl:justify-between p-3">
        <span className="text-white text-caption-sm! lg:text-caption-md!">گناه فرشته</span>
        <span className="hidden xl:flex items-center gap-[2px] text-gray-8 text-caption-md!">
          93%
          <Heart variant="Outline" className="size-4 fill-gray-8" />
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 rounded-md lg:rounded-xl border border-gray-10" />
    </div>
  );
}

export default MovieCardComp;
