import { Play } from "iconsax-react";
import { Button } from "../../../ui";
import { MovieDetailPublicType, MovieListItemType } from "../../../../../types";
import Link from "next/link";
import { useLocale } from "../../../../../hooks";

function MoviePlayFunctionalityComp({ movie }: { movie: MovieListItemType | MovieDetailPublicType }) {
  const { t } = useLocale();

  return (
    <Link href="/">
      <Button className="flex items-center px-4 gap-2 min-w-[106px] lg:min-w-32 h-8 lg:h-14 rounded-md lg:rounded-lg cursor-pointer text-white text-button-s! lg:text-button-xlg!">
        <Play variant="Outline" className="fill-white size-4 lg:size-6" />
        {t("Hero.watch")}
      </Button>
    </Link>
  );
}

export default MoviePlayFunctionalityComp;
