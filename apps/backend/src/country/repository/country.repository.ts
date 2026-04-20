import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateCountryDto } from '../dto/country.dto';
import {
  RepositoryPaginationQueryProps,
  TransactionType,
} from '../../common/types/types';

@Injectable()
export class CountryRepository {
  async getCountriesCount(search: string = '') {
    return await prisma.country.count({
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

  async getAllCountries(query: RepositoryPaginationQueryProps) {
    return await prisma.country.findMany({
      include: {
        translations: {
          where: {
            language: query.lang,
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

  async getCountryDetailAdmin(countryIds: number) {
    return await prisma.country.findUnique({
      where: {
        id: countryIds,
      },
      include: {
        translations: {
          select: {
            id: true,
            created_at: true,
            updated_at: true,
            label: true,
            language: true,
          },
        },
      },
    });
  }

  async createCountry(code: string, tx: TransactionType) {
    return await tx.country.create({ data: { code } });
  }

  async deleteCountries(countryIds: number[]) {
    return await prisma.country.deleteMany({
      where: { id: { in: countryIds } },
    });
  }

  async updateCountry(
    countryIds: number,
    body: CreateCountryDto,
    tx: TransactionType,
  ) {
    return await tx.country.update({
      data: {
        code: body.code,
      },
      where: { id: countryIds },
    });
  }
}
