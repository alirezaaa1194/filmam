import pic from "@/assets/images/Image1.png";
import Image from "next/image";
import Link from "next/link";
import { Slider } from "../../../ui/slider";
function RecentWatchItemComp() {
  return (
    <Link href="/" className="block relative rounded-md lg:rounded-xl overflow-hidden select-none">
      <Image src={pic} alt="test" width={392} height={239} className="h-40 lg:h-60 object-cover" />
      <div className="absolute rounded-b-md lg:rounded-b-xl bottom-0 left-0 bg-black/30 backdrop-blur-[15px] w-full z-10 flex flex-col gap-px p-2">
        <span className="text-white text-caption-sm lg:text-body-xxs">دفتر یادداشت - فصل اول، قسمت سوم</span>
        <div className="w-full flex items-center justify-between gap-4">
          <span className="shrink-0 lg:text-caption-md text-caption-sm">13:49</span>
          <Slider defaultValue={[33]} max={100} step={1} min={0} dir="ltr" disabled />
          <span className="shrink-0 lg:text-caption-md text-caption-sm">48:23</span>
        </div>
      </div>
    </Link>
  );
}

export default RecentWatchItemComp;
