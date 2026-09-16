import { Heart, Stickynote, UserSquare, VideoPlay } from "iconsax-react";
import Image from "next/image";
import { FileTypeEnum, MovieListItemType, RoleTypeEnum } from "../../../../../types";
import { useLocale } from "@/hooks";

function PuzzleMovieItemComp({ movie }: { movie: MovieListItemType }) {
  const movieThumbnail = movie.files.find((file) => file.type === FileTypeEnum.THUMBNAIL);
  const movieCreator = movie.factors?.find((factor) => factor.role.type === RoleTypeEnum.PRESENTER);
  const total = movie.likes_count + movie.dislikes_count;
  const movieLikePercent = total === 0 ? 0 : movie.likes_count > movie.dislikes_count ? (movie.likes_count / total) * 100 : 0;
  const placeholderPath = "/images/placeholder-v.jpg";
  const { t } = useLocale();

  return (
    <div className="h-max w-fit flex gap-3">
      <Image src={movieThumbnail?.path || placeholderPath} width={106} height={173} alt={movieThumbnail?.alt_text || movie.title} className="h-auto self-stretch xl:max-w-[105px] object-cover rounded-xl border border-gray-10 bg-gray-11" />
      <div className="hidden xl:flex flex-col justify-center gap-3">
        <h5 className="text-white text-h-5 line-clamp-1">{movie.title}</h5>
        <span className="text-gray-8 flex items-center gap-1">
          <UserSquare className="size-6 fill-gray-8 shrink-0" variant="Bold" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">
            {movieCreator?.first_name} {movieCreator?.last_name}
          </span>
        </span>
        <span className="text-gray-8 flex items-center gap-1">
          <Stickynote className="size-6 fill-gray-8 shrink-0" variant="Outline" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">{t("Puzzle.realityShow")}</span>
        </span>
        <span className="text-gray-8 flex items-center gap-1">
          <Heart className="size-6 fill-gray-8 shrink-0" variant="Outline" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">{movieLikePercent}%</span>
        </span>
        <span className="text-gray-8 flex items-center gap-1">
          <VideoPlay className="size-6 fill-gray-8 shrink-0" variant="Outline" />
          <span className="text-body-xxs flex-1 text-nowrap line-clamp-1">{(movie.seasons_count ?? 0) > 1 ? `${movie.seasons_count} ${t("RecentWatch.season")}` : `${movie.episodes_count} ${t("RecentWatch.episode")}`}</span>
        </span>
      </div>
    </div>
  );
}

export default PuzzleMovieItemComp;
