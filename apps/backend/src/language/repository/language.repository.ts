import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateLanguageDto } from '../dto/language.dto';
import {
  RepositoryPaginationQueryProps,
  TransactionType,
} from '../../common/types/types';

@Injectable()
export class LanguageRepository {
  async getLanguagesCount(search: string = '') {
    return await prisma.language.count({
      where: {
        translations: {
          some: {
            label: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  async getAllLanguages(query: RepositoryPaginationQueryProps) {
    return await prisma.language.findMany({
      include: {
        translations: {
          where: {
            lang: query.lang,
          },
          select: { label: true },
        },
      },
      skip: query.page,
      take: query.page_size,
      where: {
        translations: {
          some: {
            label: {
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

  async getLanguageDetailAdmin(languageId: number) {
    return await prisma.language.findUnique({
      where: {
        id: languageId,
      },
      include: {
        translations: {
          select: {
            id: true,
            created_at: true,
            updated_at: true,
            label: true,
            lang: true,
          },
        },
      },
    });
  }

  async createLanguage(code: string, tx: TransactionType) {
    return await tx.language.create({ data: { code } });
  }

  async deleteLanguages(languageIds: number[]) {
    return await prisma.language.deleteMany({
      where: { id: { in: languageIds } },
    });
  }

  async updateLanguage(languageIds: number, body: CreateLanguageDto, tx?: TransactionType) {
    return await (tx || prisma).language.update({
      data: {
        code: body.code,
      },
      where: { id: languageIds },
    });
  }
}
