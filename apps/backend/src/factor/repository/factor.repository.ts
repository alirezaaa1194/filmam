import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { AppLanguage } from '../../generated/prisma';
import {
  RepositoryPaginationQueryProps,
  TransactionType,
} from '../../common/types/types';

@Injectable()
export class FactorRepository {
  async getFactorsCount(search: string = '') {
    return await prisma.factor.count({
      where: {
        OR: [
          {
            translations: {
              some: {
                first_name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            translations: {
              some: {
                last_name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
    });
  }

  async createFactor(slug: string, tx: TransactionType) {
    return await tx.factor.create({ data: { slug } });
  }

  async updateFactor(factorId: number, slug: string, tx: TransactionType) {
    return await tx.factor.update({
      where: {
        id: factorId,
      },
      data: { slug },
    });
  }

  async deleteFactors(factorIds: number[]) {
    return await prisma.factor.deleteMany({
      where: {
        id: {
          in: factorIds,
        },
      },
    });
  }

  async getFactorDetailPublic(factorSlug: string, lang: AppLanguage) {
    return await prisma.factor.findUnique({
      where: {
        slug: factorSlug,
      },
      include: {
        files: {
          include: {
            upload: true,
          },
        },
        translations: {
          where: {
            language: lang,
          },
        },
      },
    });
  }

  async getFactorDetailAdmin(factorId: number) {
    return await prisma.factor.findUnique({
      where: {
        id: factorId,
      },
      include: {
        files: {
          include: {
            upload: true,
          },
        },
        translations: true,
      },
    });
  }

  async getAllFactors(query: RepositoryPaginationQueryProps) {
    const searchTerms = query.search?.trim().split(/\s+/) ?? [];
    return await prisma.factor.findMany({
      include: {
        files: {
          include: {
            upload: {
              select: { path: true },
            },
          },
        },
        translations: {
          where: {
            language: query.lang,
          },
        },
      },
      where: searchTerms.length
        ? {
            AND: searchTerms.map((term) => ({
              OR: [
                {
                  translations: {
                    some: {
                      first_name: {
                        contains: term,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
                {
                  translations: {
                    some: {
                      last_name: {
                        contains: term,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              ],
            })),
          }
        : undefined,
      orderBy: {
        created_at: query.sort_type,
      },
      skip: query.page,
      take: query.page_size,
    });
  }
}
