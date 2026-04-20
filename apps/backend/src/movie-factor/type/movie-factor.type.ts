import { CreateMovieFactorsDto } from '../dto/movie-factor.dto';

export type CreateMovieFactorsBodyType = CreateMovieFactorsDto & {
  movie_id: number;
  order: number;
};
