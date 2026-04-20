import { Injectable } from '@nestjs/common';
import { MovieGenreRepository } from './repository/movie-genre.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieGenreService {
  constructor(private movieGenreRepository: MovieGenreRepository) {}
  async createMovieGenres(
    body: number[],
    movieId: number,
    tx: TransactionType,
  ) {
    const movieGenres = body.map((movieGenre) => ({
      genre_id: movieGenre,
      movie_id: movieId,
    }));
    return await this.movieGenreRepository.createMovieGenres(movieGenres, tx);
  }

  async updateMovieGenres(
    body: number[],
    movieId: number,
    tx: TransactionType,
  ) {
    await this.movieGenreRepository.deleteMovieGenres(movieId, tx);
    return await this.createMovieGenres(body, movieId, tx);
  }
}
