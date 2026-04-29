import { CommentEntityType } from '@prisma/client';

export type CreateCommentRepositoryBodyType = {
  episode_id?: number;
  movie_id: number;
  entity_type: CommentEntityType;
  body: string;
};