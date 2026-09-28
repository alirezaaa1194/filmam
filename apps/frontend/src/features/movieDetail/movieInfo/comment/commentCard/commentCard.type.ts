import { CommentEntityTypeEnum, CommentType } from "../../../../../types";

export type CommentCardCompProps = {
  entitySlug: string;
  entityType: CommentEntityTypeEnum;
  comment: CommentType;
};
