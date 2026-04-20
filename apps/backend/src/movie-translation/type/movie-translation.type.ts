import { CreateMovieTranslationDto } from "../dto/movie-translation.dto";

export type CreateMovieTranslationBodyType = CreateMovieTranslationDto & {
  movie_id: number;
};
