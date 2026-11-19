"use client";
import { Heart } from "iconsax-react";
import Image from "next/image";
import { FileTypeEnum, MovieBriefType, MovieDetailPublicType, MovieListItemType, MovieTypeEnum } from "../../../../types";
import { useLocale } from "../../../../hooks";
import { movieLikePercentCalc } from "../../../../lib/utils";

type MovieCardEntity = MovieListItemType | MovieDetailPublicType | Pick<MovieBriefType, "title" | "files" | "type" | "likes_count" | "dislikes_count">;

function MovieCardComp({ movie, compact = false, titleClassName = "" }: { movie: MovieCardEntity; compact?: boolean; titleClassName?: string }) {
  const { t } = useLocale();
  const movieCover = movie.files.find((file) => file.type === FileTypeEnum.THUMBNAIL) ?? movie.files.find((file) => file.type === FileTypeEnum.POSTER);
  const placeholderPath = "/images/placeholder-v.jpg";

  return (
    <div className={`relative rounded-xl select-none ${compact ? "h-auto aspect-[0.56] xl:h-[370px] xl:aspect-auto" : "h-[300px] xl:h-[370px]"}`}>
      <span className="absolute top-[6px] start-[6px] text-white text-caption-md px-2 bg-black/70 backdrop-blur-[5px] rounded-md">{movie.type === MovieTypeEnum.SERIES ? t("Movie.Series") : t("Movie.Film")}</span>
      <Image draggable={false} src={movieCover?.path || placeholderPath} alt={movie.title} width={207} height={370} className="w-full h-full object-cover rounded-xl bg-gray-11" />
      <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-[10px] flex items-center justify-center xl:justify-between p-3 rounded-b-xl">
        <span className={`text-white text-caption-md ${titleClassName}`}>{movie.title}</span>
        <span className="hidden xl:flex items-center gap-[2px] text-gray-8 text-caption-md!">
          {movieLikePercentCalc(movie.likes_count ?? 0, movie.dislikes_count ?? 0)}% {<Heart variant="Outline" className="size-4 fill-gray-8" />}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 rounded-xl border border-gray-10" />
    </div>
  );
}

export default MovieCardComp;
