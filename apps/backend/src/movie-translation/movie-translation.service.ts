import { Injectable } from '@nestjs/common';
import { CreateMovieTranslationDto } from './dto/movie-translation.dto';
import { MovieTranslationRepository } from './repository/movie-translation.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieTranslationService {
  constructor(private movieTranslationRepository: MovieTranslationRepository) {}
  async createMovieTranslations(
    body: CreateMovieTranslationDto[],
    movieId: number,
    tx: TransactionType,
  ) {
    const movieTranslations = body.map((movieTranslation) => ({
      ...movieTranslation,
      movie_id: movieId,
    }));
    return await this.movieTranslationRepository.createMovieTranslation(
      movieTranslations,
      tx,
    );
  }

  async updateMovieTranslation(
    body: CreateMovieTranslationDto[],
    movieId: number,
    tx: TransactionType,
  ) {
    await this.movieTranslationRepository.deleteMovieTranslations(movieId, tx);
    return await this.createMovieTranslations(body, movieId, tx);
  }
}
