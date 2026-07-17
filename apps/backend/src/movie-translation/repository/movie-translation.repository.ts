import { AppLanguage } from '../../generated/prisma';
import { TransactionType } from '../../common/types/types';
import { CreateMovieTranslationBodyType } from '../type/movie-translation.type';
import { prisma } from '../../lib/prisma';

export class MovieTranslationRepository {
  async createMovieTranslation(
    body: CreateMovieTranslationBodyType[],
    tx: TransactionType,
  ) {
    return await tx.movieTranslation.createMany({
      data: body,
    });
  }

  async deleteMovieTranslations(movieId: number, tx: TransactionType) {
    return await tx.movieTranslation.deleteMany({
      where: {
        movie_id: movieId,
      },
    });
  }

  async findByMovieIds(movieIds: number[], lang: AppLanguage) {
    return prisma.movieTranslation.findMany({
      where: {
        movie_id: { in: movieIds },
        language: lang,
      },
      select: { movie_id: true, title: true },
    });
  }
}
