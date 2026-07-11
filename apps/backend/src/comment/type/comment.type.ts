import { CommentEntityType } from '../../generated/prisma';

export type CreateCommentRepositoryBodyType = {
  episode_id?: number;
  movie_id: number;
  entity_type: CommentEntityType;
  body: string;
};