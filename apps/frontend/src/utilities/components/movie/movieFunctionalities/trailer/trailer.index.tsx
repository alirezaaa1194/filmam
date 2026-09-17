import { Play, VideoPlay } from "iconsax-react";
import { Button } from "../../../ui";
import { MovieDetailPublicType, MovieListItemType } from "../../../../../types";
import Link from "next/link";
import { useLocale } from "../../../../../hooks";

function MovieTrailerFunctionalityComp({ movie }: { movie: MovieListItemType | MovieDetailPublicType }) {
  const { t } = useLocale();

  return (
    <Link href="/">
      <Button className="flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg! bg-gray-11 hover:bg-gray-11/80">
        <VideoPlay variant="Outline" className="fill-white size-4 lg:size-6" />
        {t("Hero.watchTrailer")}
      </Button>
    </Link>
  );
}

export default MovieTrailerFunctionalityComp;
