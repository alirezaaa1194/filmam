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
import { AppLanguage } from '../generated/prisma';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieFactorService {
  constructor(private movieFactorRepository: MovieFactorRepository) {}
  async createMovieFactors(
    body: CreateMovieFactorsDto[],
    movieId: number,
    tx: TransactionType,
  ) {
    const roleIds = [...new Set(body.map((movieFactor) => movieFactor.role_id))];
    const roles = await tx.role.findMany({
      where: { id: { in: roleIds } },
      include: {
        translations: {
          select: {
            language: true,
            name: true,
          },
        },
      },
    });
    const roleNames = new Map<number, Map<AppLanguage, string>>();
    roles.forEach((role) => {
      const names = new Map<AppLanguage, string>();
      role.translations.forEach((translation) => {
        names.set(translation.language, translation.name);
      });
      roleNames.set(role.id, names);
    });

    const movieFactors = body.map((movieFactor) => {
      const names = roleNames.get(movieFactor.role_id) ?? new Map();
      return {
        ...movieFactor,
        movie_id: movieId,
        translations: movieFactor.translations.map((translation) => ({
          ...translation,
          role_name:
            translation.role_name?.trim() ||
            names.get(translation.lang) ||
            names.values().next().value ||
            '',
        })),
      };
    });
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
