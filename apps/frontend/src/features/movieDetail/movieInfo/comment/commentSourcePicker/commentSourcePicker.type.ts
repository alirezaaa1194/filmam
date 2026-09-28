import { CommentEntityTypeEnum } from "../../../../../types";

type CommentSourceType = {
  entityId: number;
  entityType: CommentEntityTypeEnum;
  entitySlug: string;
};

export type CommentSourcePickerProps = { movieSlug: string; movieTitle?: string; movieId: number; commentSource: CommentSourceType; setCommentSource: (value: CommentSourceType) => void };
