import { AppLanguage } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { CreateMovieFactorsBodyType } from '../type/movie-factor.type';
import { TransactionType } from '../../common/types/types';

export class MovieFactorRepository {
  async getFactorMoviesCount(factorSlug: string) {
    return await prisma.movieFactor.count({
      where: {
        factor: {
          slug: factorSlug,
        },
      },
    });
  }
  async createMovieFactors(
    body: CreateMovieFactorsBodyType[],
    tx: TransactionType,
  ) {
    const createdMovieFactors = body.map(async (movieFactor) => {
      const { translations, ...otherMovieFactorData } = movieFactor;
      const createdMovieFactor = await tx.movieFactor.create({
        data: otherMovieFactorData,
      });
      const normalizedMovieFactorTranslation = translations.map((tr) => ({
        movie_factor_id: createdMovieFactor.id,
        language: tr.lang,
        ...tr,
      }));

      return await tx.movieFactorTranslation.createMany({
        data: normalizedMovieFactorTranslation,
      });
    });
    return await Promise.all(createdMovieFactors);
  }

  async deleteMovieFactors(movieId: number, tx: TransactionType) {
    return await tx.movieFactor.deleteMany({
      where: {
        movie_id: movieId,
      },
    });
  }

  async getFactorMovies(
    factorSlug: string,
    lang: AppLanguage,
    page: number,
    pageSize: number,
  ) {
    return await prisma.movieFactor.findMany({
      where: {
        factor: {
          slug: factorSlug,
        },
      },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        movie: {
          include: {
            translations: {
              select: {
                title: true,
              },
              where: {
                language: lang,
              },
            },
            files: {
              select: {
                upload: true,
                type: true,
              },
            },
          },
        },
      },
      skip: page,
      take: pageSize,
    });
  }
}
