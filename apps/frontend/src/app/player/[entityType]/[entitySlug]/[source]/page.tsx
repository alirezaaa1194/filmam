import { notFound } from "next/navigation";
import PlayerComp from "../../../../../features/player/player.index";
import { AppApis } from "../../../../../data";
import { ServerCall } from "../../../../../scripts/server";
import { CommentEntityTypeEnum, EpisodeDetailPublicType, FileTypeEnum, MovieDetailPublicType } from "../../../../../types";

type PlayerSourcePageProps = {
  params: Promise<{ entityType: string; entitySlug: string; source: string }>;
};

export async function generateMetadata({ params }: PlayerSourcePageProps) {
  const { entityType, entitySlug, source } = await params;
  const normalizedType = entityType.toUpperCase();
  const isTrailer = source.toUpperCase() === FileTypeEnum.TRAILER;

  if (normalizedType === CommentEntityTypeEnum.MOVIE) {
    const data = await ServerCall<MovieDetailPublicType>(AppApis.movie.detail(entitySlug), { method: "GET" });
    return { title: `${isTrailer ? "پیشنمایش " : ""}${data.title}`, description: data.short_description };
  }

  const data = await ServerCall<EpisodeDetailPublicType>(AppApis.episode.bySlug(entitySlug), { method: "GET" });
  return { title: `${isTrailer ? "پیشنمایش " : ""}${data.movie.title} - فصل ${data.season.order} قسمت ${data.order}`, description: data.movie.short_description };
}

export default async function PlayerSourcePage({ params }: PlayerSourcePageProps) {
  const { entityType, entitySlug, source } = await params;
  const normalizedType = entityType.toUpperCase();
  const normalizedSource = source.toUpperCase();

  if (
    (normalizedType !== CommentEntityTypeEnum.MOVIE && normalizedType !== CommentEntityTypeEnum.EPISODE) ||
    (normalizedSource !== FileTypeEnum.FILM && normalizedSource !== FileTypeEnum.TRAILER)
  ) {
    notFound();
  }

  return <PlayerComp entityType={normalizedType} entitySlug={entitySlug} source={normalizedSource} />;
}
