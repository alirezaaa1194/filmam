import { CommentEntityType, Prisma, UserMovie, UserMovieType } from '@prisma/client';
import { UpdateUserMoviesDto } from '../dto/user-movie.dto';
import { TransactionType } from '../../common/types/types';

export type GetUserMovieByTypeBodyType = {
  entity_type: CommentEntityType;
  episode_id?: number;
  movie_id?: number;
  type: UserMovieType[];
};

export type SubmitUserMovieActionProps = {
  userId: number;
  body: UpdateUserMoviesDto;
  actionMode: 'DELETE' | 'UPDATE';
  tx: TransactionType;
  hasUserDidAction?: UserMovie;
  callback?: Promise<Prisma.BatchPayload>;
};
