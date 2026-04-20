import { MovieFileType } from '@prisma/client';

export type CreateMovieFileBodyType = {
  movie_id: number;
  type: MovieFileType;
  upload_id: number;
};
