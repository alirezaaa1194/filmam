import { Injectable } from '@nestjs/common';
import { AppLanguage } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { CreateGenreTranslationDto } from '../dto/genre-translation.dto';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class GenreTranslationRepository {
  async createGenreTranslation(
    body: CreateGenreTranslationDto[],
    genreId: number,
    tx: TransactionType,
  ) {
    const genreTranslationData = body.map((genreTranslation) => ({
      genre_id: genreId,
      language: genreTranslation.lang,
      name: genreTranslation.name,
    }));

    return await tx.genreTranslation.createMany({
      data: genreTranslationData,
    });
  }

  async updateGenreTranslation(
    genreId: number,
    body: CreateGenreTranslationDto[],
    tx: TransactionType,
  ) {
    const genreTranslationData = body.map((genreTranslation) => ({
      genre_id: genreId,
      language: genreTranslation.lang,
      name: genreTranslation.name,
    }));

    await tx.genreTranslation.deleteMany({
      where: {
        genre_id: genreId,
      },
    });

    return await tx.genreTranslation.createMany({
      data: genreTranslationData,
    });
  }

  async findByGenreIds(genreIds: number[], lang: AppLanguage) {
    return prisma.genreTranslation.findMany({
      where: {
        genre_id: { in: genreIds },
        language: lang,
      },
      select: { genre_id: true, name: true },
    });
  }
}
