import { MovieFileType } from '../../generated/prisma';

export type CreateMovieFileBodyType = {
  movie_id: number;
  type: MovieFileType;
  upload_id: number;
  intro_duration?: number;
  intro_start_time?: number;
  outro_duration?: number;
};
