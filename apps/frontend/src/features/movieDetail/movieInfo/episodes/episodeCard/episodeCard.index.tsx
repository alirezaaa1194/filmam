import Image from "next/image";
import { AuthModeEnum, FileTypeEnum, SeasonEpisodeType, UserMovieTypeEnum } from "../../../../../types";
import Link from "next/link";
import { useLocale } from "../../../../../hooks";
import { Button, Separator } from "../../../../../utilities/components/ui";
import { Dislike, Like1 } from "iconsax-react";
import { useEpisodeAction } from "./episodeCard.script";
import { use } from "react";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";
import { CheckCheck } from "lucide-react";

function EpisodeCardComp({ episode }: { episode: SeasonEpisodeType }) {
  const isWatching = episode.user_movies.some((eum) => eum.type === UserMovieTypeEnum.WATCHING);
  const isWatched = episode.user_movies.some((eum) => eum.type === UserMovieTypeEnum.WATCHED);
  const episodeCover = episode.files.find((file) => file.type === FileTypeEnum.COVER);
  const placeholderPath = "/images/placeholder-v.jpg";
  const { t, dir } = useLocale();

  const { toggleEpisodeAction: likeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.LIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
  const { toggleEpisodeAction: dislikeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.DISLIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");

  const isCurrentlyLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.LIKE);
  const isCurrentlyDisLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.DISLIKE);
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);

  return (
    <div className="w-full border border-gray-12 bg-gray-13 rounded-md lg:rounded-xl px-2 lg:px-4 py-4 flex gap-2 lg:gap-4 items-stretch">
      <Image src={episodeCover?.path || placeholderPath} alt={episodeCover?.alt_text || episode.title} width={156} height={198} className="shrink-0 w-[97px] h-full lg:w-[156px] lg:h-[198px] object-cover rounded-lg bg-gray-11" />
      <div className="flex flex-col flex-1 gap-4 lg:gap-5">
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className="w-full flex items-center gap-3 justify-between">
            <Link href="" className="text-white text-mobile-body-sm lg:text-body-xs w-fit">
              {dir === "rtl" ? `${t("Movie.Series")} ${episode.movie_title}` : `${episode.movie_title} ${t("Movie.Series")}`}
            </Link>
            {isWatched ? (
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                <CheckCheck className="size-3 text-primary" strokeWidth={2.5} />
              </span>
            ) : null}
          </div>
          <span className="text-gray-4 text-caption-md lg:text-body-xxs">
            {episode.season_title} - {t("RecentWatch.episode")} {episode.order}
          </span>
        </div>
        <Separator className="bg-gray-12 w-full" />
        <div className="flex gap-4 lg:gap-5 mt-0 lg:mt-6">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (user) {
                  likeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyLiked });
                } else {
                  setAuthMode({
                    mode: AuthModeEnum.LOGIN,
                    callback: () => {
                      likeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyLiked });
                    },
                  });
                }
              }}
              className={`size-8 lg:size-12 rounded-md cursor-pointer border ${isCurrentlyLiked ? "border-primary bg-primary hover:bg-primary/80 hover:border-primary/80 [&>svg]:fill-white" : "border-gray-7 bg-transparent hover:border-primary hover:bg-transparent [&>svg]:fill-gray-7 hover:[&>svg]:fill-primary"}`}
            >
              <Like1 variant={isCurrentlyLiked ? "Bold" : "Outline"} className="transition-all size-4 lg:size-6" />
            </Button>
            <Button
              onClick={() => {
                if (user) {
                  dislikeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyDisLiked });
                } else {
                  setAuthMode({
                    mode: AuthModeEnum.LOGIN,
                    callback: () => {
                      dislikeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyDisLiked });
                    },
                  });
                }
              }}
              className={`size-8 lg:size-12 rounded-md cursor-pointer border ${isCurrentlyDisLiked ? "border-complementary bg-complementary hover:bg-complementary/80 hover:border-complementary/80 [&>svg]:fill-white" : "border-gray-7 bg-transparent hover:border-complementary hover:bg-transparent [&>svg]:fill-gray-7 hover:[&>svg]:fill-complementary"}`}
            >
              <Dislike variant={isCurrentlyDisLiked ? "Bold" : "Outline"} className="transition-all size-4 lg:size-6" />
            </Button>
          </div>
          <Button className="flex-1 h-full cursor-pointer rounded-md text-button-s! lg:text-button-md!">{isWatching ? "ادامه تماشا" : isWatched ? "تماشای دوباره" : "تماشا"}</Button>
        </div>
      </div>
    </div>
  );
}

export default EpisodeCardComp;
