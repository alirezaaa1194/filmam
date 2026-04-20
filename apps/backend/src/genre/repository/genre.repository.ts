import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { AppLanguage } from '@prisma/client';
import { CreateGenreDto } from '../dto/genre.dto';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class GenreRepository {
  async getGenresCount(search: string = '') {
    return await prisma.genre.count({
      where: {
        translations: {
          some: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  async getAllGenres(query: {
    page: number;
    page_size: number;
    search: string;
    sort_type: 'asc' | 'desc';
    lang: AppLanguage;
  }) {
    return await prisma.genre.findMany({
      include: {
        translations: {
          where: {
            language: query.lang,
          },
          select: { name: true },
        },
      },
      skip: query.page,
      take: query.page_size,
      where: {
        translations: {
          some: {
            name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      },
      orderBy: {
        created_at: query.sort_type,
      },
    });
  }

  async getGenreDetailAdmin(genreId: number) {
    return await prisma.genre.findUnique({
      where: {
        id: genreId,
      },
      include: {
        translations: {
          select: {
            id: true,
            created_at: true,
            updated_at: true,
            name: true,
            language: true,
          },
        },
      },
    });
  }

  async createGenre(slug: string, tx: TransactionType) {
    return await tx.genre.create({ data: { slug } });
  }

  async deleteGenres(genreIds: number[]) {
    return await prisma.genre.deleteMany({
      where: { id: { in: genreIds } },
    });
  }

  async updateGenre(genreId: number, body: CreateGenreDto) {
    return await prisma.genre.update({
      data: {
        slug: body.slug,
      },
      where: { id: genreId },
    });
  }
}
