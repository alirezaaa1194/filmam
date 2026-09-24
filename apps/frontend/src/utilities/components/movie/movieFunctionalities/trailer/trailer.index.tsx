import { VideoPlay } from "iconsax-react";
import { Button } from "../../../ui";
import { MovieDetailPublicType, MovieListItemType } from "../../../../../types";
import Link from "next/link";
import { useLocale } from "../../../../../hooks";

function MovieTrailerFunctionalityComp({ movie }: { movie: MovieListItemType | MovieDetailPublicType }) {
  const { t } = useLocale();

  return (
    <Link href="/" className="w-full lg:w-fit">
      <Button className="w-full lg:w-fit flex items-center gap-2 px-12 h-[46px] rounded-md cursor-pointer text-white text-button-md! lg:text-button-lg! bg-gray-11 hover:bg-gray-11/80">
        <VideoPlay variant="Outline" className="fill-white size-5" />
        {t("Hero.watchTrailer")}
      </Button>
    </Link>
  );
}

export default MovieTrailerFunctionalityComp;
