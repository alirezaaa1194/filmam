import { notFound } from "next/navigation";
import PlayerComp from "../../../../features/player/player.index";
import { CommentEntityTypeEnum, EpisodeDetailPublicType, FileTypeEnum, MovieDetailPublicType } from "../../../../types";
import { ServerCall } from "../../../../scripts/server";
import { AppApis } from "../../../../data";

export async function generateMetadata({ params, searchParams }: PageProps<"/player/[entityType]/[entitySlug]">) {
  const { entitySlug, entityType } = await params;
  const { source } = await searchParams;

  if (entityType === CommentEntityTypeEnum.MOVIE) {
    const data = await ServerCall<MovieDetailPublicType>(AppApis.movie.detail(entitySlug), { method: "GET" });
    return {
      title: `${source === FileTypeEnum.TRAILER ? "پیشنمایش " : ""}${data.title}`,
      description: data.short_description,
    };
  }

  const data = await ServerCall<EpisodeDetailPublicType>(AppApis.episode.bySlug(entitySlug), { method: "GET" });
  return {
    title: `${source === FileTypeEnum.TRAILER ? "پیشنمایش " : ""}${data.movie.title} - فصل ${data.season.order} قسمت ${data.order}`,
    description: data.movie.short_description,
  };
}

async function page({ params, searchParams }: PageProps<"/player/[entityType]/[entitySlug]">) {
  const pageParams = await params;
  const { source } = await searchParams;
  const entityType = pageParams.entityType.toUpperCase();
  const entitySlug = pageParams.entitySlug;

  if (entityType !== CommentEntityTypeEnum.MOVIE && entityType !== CommentEntityTypeEnum.EPISODE) {
    notFound();
  }

  if (!source || (source !== FileTypeEnum.FILM && source !== FileTypeEnum.TRAILER)) {
    notFound();
  }

  return <PlayerComp entityType={entityType} entitySlug={entitySlug} source={source} />;
}

export default page;
