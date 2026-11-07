import { CommentEntityTypeEnum, MovieTypeEnum } from "@/types";
import { useLocale } from "../../../../../hooks";

export default function TitleComp({ entityType, data }: { entityType: CommentEntityTypeEnum; data: any }) {
  const { t, dir } = useLocale();
  const isSeries = entityType === CommentEntityTypeEnum.EPISODE || data.type === MovieTypeEnum.SERIES;
  const titleTemplate = isSeries ? t("Player.seriesTitle") : t("Player.movieTitle");
  const [titlePrefix = "", titleSuffix = ""] = titleTemplate.split("--");
  const entityTitle = entityType === CommentEntityTypeEnum.MOVIE ? data.title : data.movie.title;
  return (
    <div className="flex flex-col gap-1">
      <h6 dir={dir} className="text-right text-white text-body-xxs font-bold lg:text-h-6"><span>{titlePrefix}</span><bdi dir="auto">{entityTitle}</bdi><span>{titleSuffix}</span></h6>
      {entityType === CommentEntityTypeEnum.EPISODE ? (
        <span className="text-white text-caption-md lg:text-body-xxs">
          {Number(data.movie.seasons_count) > 1 ? `${t("MovieDetail.season")} ${data.season.order}` : ""} {t("Player.episode")} {data.order}
        </span>
      ) : null}
    </div>
  );
}
