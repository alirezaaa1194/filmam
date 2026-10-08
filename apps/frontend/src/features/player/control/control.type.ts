import { CommentEntityTypeEnum, EpisodeDetailPublicType, FileTypeEnum, MovieDetailPublicType } from "../../../types";

export type PlayerControlProps =
  | {
      entityType: CommentEntityTypeEnum.MOVIE;
      source: FileTypeEnum.FILM | FileTypeEnum.TRAILER;
      data: MovieDetailPublicType;
    }
  | {
      entityType: CommentEntityTypeEnum.EPISODE;
      source: FileTypeEnum.FILM | FileTypeEnum.TRAILER;
      data: EpisodeDetailPublicType;
    };

export type RippleType = "play" | "pause" | "forward" | "backward";
