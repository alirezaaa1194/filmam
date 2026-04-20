import { Injectable } from '@nestjs/common';
import { MovieLanguageRepository } from './repository/movie-language.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieLanguageService {
  constructor(private movieLanguageRepository: MovieLanguageRepository) {}
  async createMovieLanguages(
    body: number[],
    movieId: number,
    tx: TransactionType,
  ) {
    const movieLanguages = body.map((movieLanguage) => ({
      language_id: movieLanguage,
      movie_id: movieId,
    }));
    return await this.movieLanguageRepository.createMovieLanguages(
      movieLanguages,
      tx,
    );
  }

  async updateMovieLanguages(
    body: number[],
    movieId: number,
    tx: TransactionType,
  ) {
    await this.movieLanguageRepository.deleteMovieLanguages(movieId, tx);
    return await this.createMovieLanguages(body, movieId, tx);
  }
}
