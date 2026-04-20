import { CommentEntityType, UserMovieType } from '@prisma/client';

export type GetUserMovieByTypeBodyType = {
  entity_type: CommentEntityType;
  episode_id?: number;
  movie_id?: number;
  type: UserMovieType[];
};
