import { CommentEntityTypeEnum, MovieDetailPublicType } from "../../../../types";

export type CommentSectionCompProps = {
  entitySlug: string;
  entityId: number;
  entityType: CommentEntityTypeEnum;
  movieTitle?: string;
  movie?: MovieDetailPublicType;
};
