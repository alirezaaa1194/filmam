import { MovieFileType } from '../../generated/prisma';

export type CreateMovieFileBodyType = {
  movie_id: number;
  type: MovieFileType;
  upload_id: number;
};
