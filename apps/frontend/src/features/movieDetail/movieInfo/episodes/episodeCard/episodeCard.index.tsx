// import Image from "next/image";
// import { AuthModeEnum, FileTypeEnum, SeasonEpisodeType, UserMovieTypeEnum } from "../../../../../types";
// import { useLocale } from "../../../../../hooks";
// import { Button, Separator } from "../../../../../utilities/components/ui";
// import { Clock, Dislike, Like1 } from "iconsax-react";
// import { useEpisodeAction } from "./episodeCard.script";
// import { use } from "react";
// import { UserContext } from "../../../../../contexts";
// import { AuthModalContext } from "../../../../../contexts/authModal";
// import { CheckCheck } from "lucide-react";
// import { formatDuration } from "../../../../../lib/utils";

// function EpisodeCardComp({ episode }: { episode: SeasonEpisodeType }) {
//   const isWatching = episode.user_movies.find((eum) => eum.type === UserMovieTypeEnum.WATCHING);
//   const isWatched = episode.user_movies.some((eum) => eum.type === UserMovieTypeEnum.WATCHED);
//   const episodeCover = episode.files.find((file) => file.type === FileTypeEnum.COVER);
//   const placeholderPath = "/images/placeholder-v.jpg";
//   const { t } = useLocale();

//   const { toggleEpisodeAction: likeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.LIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
//   const { toggleEpisodeAction: dislikeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.DISLIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");

//   const isCurrentlyLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.LIKE);
//   const isCurrentlyDisLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.DISLIKE);
//   const user = use(UserContext);
//   const { setAuthMode } = use(AuthModalContext);
//   const filmFile = episode.files.find((file) => file.type === FileTypeEnum.FILM);

//   const duration = Number(filmFile?.duration || 0);
//   const progressTime = Number(episode.watch_progress_time || 0);
//   const progressPercent = duration > 0 ? Math.min((progressTime / duration) * 100, 100) : 0;

//   return (
//     <div className="w-full border border-gray-12 bg-gray-13 rounded-md lg:rounded-xl p-3 lg:p-4 flex gap-3 lg:gap-4">
//       <Image src={episodeCover?.path || placeholderPath} alt={episodeCover?.alt_text || episode.title} width={156} height={198} className="shrink-0 w-[110px] lg:w-[156px] aspect-[110/145] lg:aspect-[156/198] object-cover rounded-lg bg-gray-11" />

//       <div className="flex flex-col flex-1 min-w-0">
//         <div className="flex flex-col gap-1 lg:gap-2">
//           <div className="w-full flex items-center justify-between gap-3">
//             <span className="text-white text-mobile-body-sm lg:text-body-xs">
//               فصل {episode.season_order} - {t("RecentWatch.episode")} {episode.order}
//             </span>
//             {isWatched ? (
//               <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-primary/15 ring-1 ring-primary/30 size-5 md:size-auto justify-center md:pl-2 md:pr-1.5">
//                 <CheckCheck className="size-3 text-primary" strokeWidth={2.5} />
//                 <span className="text-caption-sm lg:text-caption-md text-primary whitespace-nowrap font-bold hidden md:block">دیده شده</span>
//               </span>
//             ) : null}
//           </div>
//           {!isWatching ? <p className="text-gray-8 text-caption-md lg:text-body-xxs line-clamp-2">{episode.short_description}</p> : null}
//         </div>

//         <div className="flex items-start justify-between gap-4 mt-auto">
//           <span className="flex items-center gap-2 text-caption-md text-gray-8 lg:min-w-[104px]">
//             <Clock variant="Outline" className="size-4 fill-gray-8" />
//             {formatDuration(duration, {
//               second: "ثانیه",
//               minute: "دقیقه",
//               hour: "ساعت",
//             })}
//           </span>
//           {isWatching ? (
//             <div className="flex-1 max-w-[452px] flex flex-col gap-2">
//               <span className="text-caption-md flex gap-1">
//                 <span className="text-gray-8 hidden lg:inline-block">مشاهده شده:</span>
//                 <span className="text-primary hidden lg:inline-block">
//                   {formatDuration(progressTime, {
//                     second: "ثانیه",
//                     minute: "دقیقه",
//                     hour: "ساعت",
//                   })}
//                 </span>
//               </span>
//               <div className="bg-gray-11 w-full h-1" dir="ltr">
//                 <span className="block h-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${progressPercent}%` }} />
//               </div>
//             </div>
//           ) : null}
//         </div>

//         <div className="pt-4">
//           <Separator className="bg-gray-12 w-full mb-3 lg:mb-4" />
//           <div className="flex gap-3 lg:gap-4">
//             <div className="flex gap-2">
//               <Button
//                 onClick={() => {
//                   if (user) {
//                     likeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyLiked });
//                   } else {
//                     setAuthMode({
//                       mode: AuthModeEnum.LOGIN,
//                       callback: () => {
//                         likeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyLiked });
//                       },
//                     });
//                   }
//                 }}
//                 className={`size-8 lg:size-12 rounded-md cursor-pointer border ${isCurrentlyLiked ? "border-primary bg-primary hover:bg-primary/80 hover:border-primary/80 [&>svg]:fill-white" : "border-gray-7 bg-transparent hover:border-primary hover:bg-transparent [&>svg]:fill-gray-7 hover:[&>svg]:fill-primary"}`}
//               >
//                 <Like1 variant={isCurrentlyLiked ? "Bold" : "Outline"} className="transition-all size-4 lg:size-6" />
//               </Button>
//               <Button
//                 onClick={() => {
//                   if (user) {
//                     dislikeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyDisLiked });
//                   } else {
//                     setAuthMode({
//                       mode: AuthModeEnum.LOGIN,
//                       callback: () => {
//                         dislikeToggleEpisodeAction({ episodeId: episode.id, isCurrentlySaved: isCurrentlyDisLiked });
//                       },
//                     });
//                   }
//                 }}
//                 className={`size-8 lg:size-12 rounded-md cursor-pointer border ${isCurrentlyDisLiked ? "border-complementary bg-complementary hover:bg-complementary/80 hover:border-complementary/80 [&>svg]:fill-white" : "border-gray-7 bg-transparent hover:border-complementary hover:bg-transparent [&>svg]:fill-gray-7 hover:[&>svg]:fill-complementary"}`}
//               >
//                 <Dislike variant={isCurrentlyDisLiked ? "Bold" : "Outline"} className="transition-all size-4 lg:size-6" />
//               </Button>
//             </div>
//             <Button className="flex-1 h-8 lg:h-12 cursor-pointer rounded-md text-button-s! lg:text-button-md!">{isWatching ? "ادامه تماشا" : isWatched ? "تماشای دوباره" : "تماشا"}</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EpisodeCardComp;


import Image from "next/image";
import { AuthModeEnum, FileTypeEnum, SeasonEpisodeType, UserMovieTypeEnum } from "../../../../../types";
import { useLocale } from "../../../../../hooks";
import { Button, Separator } from "../../../../../utilities/components/ui";
import { Clock, Dislike, Like1 } from "iconsax-react";
import { useEpisodeAction } from "./episodeCard.script";
import { use } from "react";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";
import { CheckCheck } from "lucide-react";
import { formatDuration } from "../../../../../lib/utils";

function EpisodeCardComp({ episode }: { episode: SeasonEpisodeType }) {
  const isWatching = episode.user_movies.find((eum) => eum.type === UserMovieTypeEnum.WATCHING);
  const isWatched = episode.user_movies.some((eum) => eum.type === UserMovieTypeEnum.WATCHED);
  const episodeCover = episode.files.find((file) => file.type === FileTypeEnum.COVER);
  const placeholderPath = "/images/placeholder-v.jpg";
  const { t } = useLocale();

  const { toggleEpisodeAction: likeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.LIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
  const { toggleEpisodeAction: dislikeToggleEpisodeAction } = useEpisodeAction(episode.season_slug, UserMovieTypeEnum.DISLIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");

  const isCurrentlyLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.LIKE);
  const isCurrentlyDisLiked = episode.user_movies.some((item) => item.type === UserMovieTypeEnum.DISLIKE);
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);
  const filmFile = episode.files.find((file) => file.type === FileTypeEnum.FILM);

  const duration = Number(filmFile?.duration || 0);
  const progressTime = Number(episode.watch_progress_time || 0);
  const progressPercent = duration > 0 ? Math.min((progressTime / duration) * 100, 100) : 0;

  return (
    <div className="w-full border border-gray-12 bg-gray-13 rounded-md lg:rounded-xl p-3 lg:p-4 flex gap-3 lg:gap-4">
      <Image
        src={episodeCover?.path || placeholderPath}
        alt={episodeCover?.alt_text || episode.title}
        width={156}
        height={198}
        className="shrink-0 w-[110px] lg:w-[156px] aspect-[110/145] lg:aspect-[156/198] object-cover rounded-lg bg-gray-11"
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-col gap-1 lg:gap-2">
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-white text-mobile-body-sm lg:text-body-xs">
              فصل {episode.season_order} - {t("RecentWatch.episode")} {episode.order}
            </span>
            {isWatched ? (
              <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-primary/15 ring-1 ring-primary/30 size-5 md:size-auto justify-center md:pl-2 md:pr-1.5">
                <CheckCheck className="size-3 text-primary" strokeWidth={2.5} />
                <span className="text-caption-sm lg:text-caption-md text-primary whitespace-nowrap font-bold hidden md:block">دیده شده</span>
              </span>
            ) : null}
          </div>
          {!isWatching ? (
            <div className="hidden lg:block">
              <p className="text-gray-8 text-body-xxs line-clamp-2">{episode.short_description}</p>
            </div>
          ) : null}
        </div>

        <div className="flex items-start justify-between gap-4 mt-auto">
          <span className="flex items-center gap-2 text-caption-md text-gray-8 lg:min-w-[104px]">
            <Clock variant="Outline" className="size-4 fill-gray-8" />
            {formatDuration(duration, {
              second: "ثانیه",
              minute: "دقیقه",
              hour: "ساعت",
            })}
          </span>
          {isWatching ? (
            <div className="flex-1 max-w-[452px] flex flex-col gap-2">
              <span className="text-caption-md flex gap-1">
                <span className="text-gray-8 hidden lg:inline-block">مشاهده شده:</span>
                <span className="text-primary hidden lg:inline-block">
                  {formatDuration(progressTime, {
                    second: "ثانیه",
                    minute: "دقیقه",
                    hour: "ساعت",
                  })}
                </span>
              </span>
              <div className="bg-gray-11 w-full h-1" dir="ltr">
                <span className="block h-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="pt-4">
          <Separator className="bg-gray-12 w-full mb-3 lg:mb-4" />
          <div className="flex gap-3 lg:gap-4">
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
            <Button className="flex-1 h-8 lg:h-12 cursor-pointer rounded-md text-button-s! lg:text-button-md!">{isWatching ? "ادامه تماشا" : isWatched ? "تماشای دوباره" : "تماشا"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpisodeCardComp;