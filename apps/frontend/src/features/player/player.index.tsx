import { AppApis } from "../../data";
import { ServerCall } from "../../scripts/server";
import { CommentEntityTypeEnum, EpisodeDetailPublicType, FileTypeEnum, MovieDetailPublicType } from "../../types";
import PlayerControlComp from "./control/control.index";

async function PlayerComp({ entityType, entitySlug, source }: { entityType: CommentEntityTypeEnum; entitySlug: string; source: FileTypeEnum.FILM | FileTypeEnum.TRAILER }) {
  if (entityType === CommentEntityTypeEnum.MOVIE) {
    const data = await ServerCall<MovieDetailPublicType>(AppApis.movie.detail(entitySlug), {
      method: "GET",
    });

    return <PlayerControlComp entityType={entityType} data={data} source={source} />;
  }

  const data = await ServerCall<EpisodeDetailPublicType>(AppApis.episode.bySlug(entitySlug), {
    method: "GET",
  });

  return <PlayerControlComp entityType={entityType} data={data} source={source} />;
}

export default PlayerComp;
