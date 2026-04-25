import { Injectable } from '@nestjs/common';
import { MovieFactorRepository } from './repository/movie-factor.repository';
import {
  CreateMovieFactorsDto,
  GetFactorMoviesDto,
} from './dto/movie-factor.dto';
import {
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieFactorService {
  constructor(private movieFactorRepository: MovieFactorRepository) {}
  async createMovieFactors(
    body: CreateMovieFactorsDto[],
    movieId: number,
    tx: TransactionType,
  ) {
    const movieFactors = body.map((movieFactor) => ({
      ...movieFactor,
      movie_id: movieId,
    }));
    return await this.movieFactorRepository.createMovieFactors(
      movieFactors,
      tx,
    );
  }

  async updateMovieFactors(
    body: CreateMovieFactorsDto[],
    movieId: number,
    tx: TransactionType,
  ) {
    await this.movieFactorRepository.deleteMovieFactors(movieId, tx);
    return await this.createMovieFactors(body, movieId, tx);
  }

  async getFactorMovies(factorSlug: string, query: GetFactorMoviesDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );

    const factorMovies = await this.movieFactorRepository.getFactorMovies(
      factorSlug,
      query.lang || defaultLang,
      page,
      page_size,
    );

    const normalizedFactorsMovies = factorMovies.map((factorMovie) => {
      return normalizeMovieDetail(factorMovie.movie);
    });
    const factorMoviesCount =
      await this.movieFactorRepository.getFactorMoviesCount(factorSlug);

    return {
      page: page + 1,
      page_size,
      count: factorMoviesCount,
      data: normalizedFactorsMovies,
    };
  }
}
