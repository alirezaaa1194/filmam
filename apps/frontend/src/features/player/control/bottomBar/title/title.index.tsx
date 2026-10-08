import { CommentEntityTypeEnum, MovieTypeEnum } from "@/types";

export default function TitleComp({ entityType, data }: { entityType: CommentEntityTypeEnum; data: any }) {
  return (
    <div className="flex flex-col gap-1">
      <h6 className="text-white text-body-xxs font-bold lg:text-h-6">{entityType === CommentEntityTypeEnum.MOVIE ? (data.type === MovieTypeEnum.SERIES ? `سریال ${data.title}` : `سینمایی ${data.title}`) : `سریال ${data.movie.title}`}</h6>
      {entityType === CommentEntityTypeEnum.EPISODE ? (
        <span className="text-white text-caption-md lg:text-body-xxs">
          {Number(data.movie.seasons_count) > 1 ? `فصل ${data.season.order}` : ""} قسمت {data.order}
        </span>
      ) : null}
    </div>
  );
}
