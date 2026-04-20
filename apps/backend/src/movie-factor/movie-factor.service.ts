import { Injectable } from '@nestjs/common';
import { MovieFactorRepository } from './repository/movie-factor.repository';
import {
  CreateMovieFactorsDto,
  GetFactorMoviesDto,
} from './dto/movie-factor.dto';
import {
  calculateMovieUserActivityCounts,
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import { UserMovieService } from '../user-movie/user-movie.service';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieFactorService {
  constructor(
    private movieFactorRepository: MovieFactorRepository,
    private userMovieService: UserMovieService,
  ) {}
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

    const movieIds = factorMovies.map((factorMovie) => factorMovie.movie.id);
    const movieUserActivities =
      await this.userMovieService.getMovieUserActivities(movieIds);

    const normalizedFactorsMovies = factorMovies.map((factorMovie) => {
      const movieUserActivitiesCounts = calculateMovieUserActivityCounts(
        movieUserActivities,
        factorMovie.movie.id,
      );
      return {
        ...normalizeMovieDetail(factorMovie.movie),
        ...movieUserActivitiesCounts,
      };
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
