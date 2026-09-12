import Link from "next/link";
import { Button } from "../../../../ui";
import { Add, ArchiveAdd, Play, VideoPlay } from "iconsax-react";
import { useLocale } from "../../../../../../hooks";

function HeroContentOptionsComp() {
  const { t } = useLocale();

  return (
    <div className="flex gap-2 lg:gap-3">
      <Link href="/">
        <Button className="flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg!">
          <Play variant="Outline" className="fill-white size-4 lg:size-6" />
          {t("Hero.watch")}
        </Button>
      </Link>
      <Button className="hidden lg:flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg! bg-gray-11 hover:bg-gray-11/80">
        <VideoPlay variant="Outline" className="fill-white size-4 lg:size-6" />
        {t("Hero.watchTrailer")}
      </Button>
      <Button variant="outline" className="flex items-center px-0 lg:px-4 gap-2 lg:min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-gray-7 text-button-s! lg:text-button-xlg! border-transparent bg-none lg:border-gray-5! lg:hover:bg-gray-5/10">
        <Add variant="Outline" className="fill-gray-7 size-4 lg:size-6 hidden lg:block" />
        <ArchiveAdd variant="Outline" className="fill-white size-6 block lg:hidden" />
        <span className="hidden lg:block">{t("Hero.addToWishlist")}</span>
      </Button>
    </div>
  );
}

export default HeroContentOptionsComp;
