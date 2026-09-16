import Image from "next/image";
import { FileTypeEnum, SeasonEpisodeType, UserMovieTypeEnum } from "../../../../../types";
import Link from "next/link";
import { useLocale } from "../../../../../hooks";
import { Button, Separator } from "../../../../../utilities/components/ui";
import { Dislike, Like1 } from "iconsax-react";
import { useEpisodeAction } from "./episodeCard.script";

function EpisodeCardComp({ episode }: { episode: SeasonEpisodeType }) {
  const episodeCover = episode.files.find((file) => file.type === FileTypeEnum.COVER);
  const placeholderPath = "/images/placeholder-v.jpg";
  const { t, dir } = useLocale();

  const { toggleEpisodeAction: likeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.LIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
  const { toggleEpisodeAction: dislikeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.DISLIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");

  const isCurrentlyLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.LIKE);
  const isCurrentlyDisLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.DISLIKE);

  return (
    <div className="w-full border border-gray-12 bg-gray-13 rounded-md lg:rounded-xl px-2 lg:px-4 py-4 flex gap-2 lg:gap-4 items-stretch">
      <Image src={episodeCover?.path || placeholderPath} alt={episodeCover?.alt_text || episode.title} width={156} height={198} className="shrink-0 w-[97px] h-full lg:w-[156px] lg:h-[198px] object-cover rounded-lg bg-gray-11" />
      <div className="flex flex-col flex-1 gap-4 lg:gap-5">
        <div className="flex flex-col gap-2 lg:gap-3">
          <Link href="" className="text-white text-mobile-body-sm lg:text-body-xs w-fit">
            {dir === "rtl" ? `${t("Movie.Series")} ${episode.movie_title}` : `${episode.movie_title} ${t("Movie.Series")}`}
          </Link>
          <span className="text-gray-4 text-caption-md lg:text-body-xxs">
            {episode.season_title} - {t("RecentWatch.episode")} {episode.order}
          </span>
        </div>
        <Separator className="bg-gray-12 w-full" />
        <div className="flex gap-4 lg:gap-5">
          <div className="flex gap-2">
            <Button onClick={() => likeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyLiked })} className={`size-8 lg:size-12 rounded-md cursor-pointer ${isCurrentlyLiked ? "bg-primary hover:bg-primary hover:opacity-80 [&>svg]:fill-white" : "border border-gray-7 bg-transparent hover:border-primary hover:bg-transparent [&>svg]:fill-gray-7 hover:[&>svg]:fill-primary"}`}>
              <Like1 variant={isCurrentlyLiked ? "Bold" : "Outline"} className="transition-all size-4 lg:size-6" />
            </Button>
            <Button onClick={() => dislikeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyDisLiked })} className={`size-8 lg:size-12 rounded-md cursor-pointer ${isCurrentlyDisLiked ? "bg-complementary hover:bg-complementary hover:opacity-80 [&>svg]:fill-white" : "border border-gray-7 bg-transparent hover:border-complementary hover:bg-transparent [&>svg]:fill-gray-7 hover:[&>svg]:fill-complementary"}`}>
              <Dislike variant={isCurrentlyDisLiked ? "Bold" : "Outline"} className="transition-all size-4 lg:size-6" />
            </Button>
          </div>
          <Button className="flex-1 h-full cursor-pointer rounded-md text-button-s! lg:text-button-md!">{t("MovieDetailPage.watch")}</Button>
        </div>
      </div>
    </div>
  );
}

export default EpisodeCardComp;
