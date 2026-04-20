import { Injectable } from '@nestjs/common';
import { MovieCountryRepository } from './repository/movie-country.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieCountryService {
  constructor(private movieCountryRepository: MovieCountryRepository) {}
  async createMovieCountries(
    body: number[],
    movieId: number,
    tx: TransactionType,
  ) {
    const movieCountries = body.map((movieCountry) => ({
      country_id: movieCountry,
      movie_id: movieId,
    }));
    return await this.movieCountryRepository.createMovieCountries(
      movieCountries,
      tx,
    );
  }

  async updateMovieCountries(
    body: number[],
    movieId: number,
    tx: TransactionType,
  ) {
    await this.movieCountryRepository.deleteMovieCountries(movieId, tx);
    return await this.createMovieCountries(body, movieId, tx);
  }
}
