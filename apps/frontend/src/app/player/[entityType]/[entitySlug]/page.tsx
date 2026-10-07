import { notFound } from "next/navigation";
import PlayerComp from "../../../../features/player/player.index";
import { CommentEntityTypeEnum, FileTypeEnum } from "../../../../types";

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
