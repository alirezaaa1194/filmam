import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateSectionDto, SectionMovieFilter } from '../dto/section.dto';
import { AppLanguage } from '@prisma/client';
import { TransactionType } from '../../common/types/types';
import { defaultLang } from '../../lib/utils';
import { SortType } from '../../common/enums';

@Injectable()
export class SectionRepository {
  async getSectionsCount(search: string = '') {
    return await prisma.section.count({
      where: {
        translations: {
          some: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  async createSectionAdmin(body: CreateSectionDto, tx: TransactionType) {
    return await tx.section.create({
      data: {
        order: body.order,
        period_base: body.period_base,
        slug: body.slug,
        selection_mode: body.selection_mode,
        sort_mode: body.sort_mode,
        view_mode: body.view_mode,
      },
    });
  }

  async getSectionMovies(
    sectionId: number,
    lang: AppLanguage = defaultLang,
    moviesSize?: number,
  ) {
    return await prisma.sectionMovie.findMany({
      where: { section_id: sectionId },
      include: {
        movie: {
          include: {
            translations: {
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
      skip: 0,
      take: moviesSize || 10,
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getSectionMoviesCount(slug: string) {
    return await prisma.movie.count({
      where: {
        section_movies: {
          some: {
            section: {
              slug,
            },
          },
        },
      },
    });
  }

  async getSectionDetailAdmin(sectionId: number, lang: AppLanguage) {
    return await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        translations: true,
        section_movies: {
          include: {
            movie: {
              include: {
                translations: { where: { language: lang } },
              },
            },
          },
        },
      },
    });
  }

  async getAllSections(
    page: number,
    pageSize: number,
    lang: AppLanguage,
    search: string = '',
    sort: SortType,
  ) {
    return await prisma.section.findMany({
      skip: page,
      take: pageSize,
      where: {
        translations: {
          some: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
      include: {
        section_filters: true,
        translations: {
          where: {
            language: lang,
          },
        },
      },
      orderBy: {
        order: sort === 'ASC' ? 'asc' : 'desc',
      },
    });
  }

  async getSectionDetailPublic(sectionSlug: string) {
    return await prisma.section.findUnique({
      where: {
        slug: sectionSlug,
      },
    });
  }

  async deleteSectionsAdmin(sections_ids: number[]) {
    return await prisma.section.deleteMany({
      where: { id: { in: sections_ids } },
    });
  }

  async updateSection(
    body: CreateSectionDto,
    sectionId: number,
    tx: TransactionType,
  ) {
    return await tx.section.update({
      where: { id: sectionId },
      data: {
        order: body.order,
        period_base: body.period_base,
        sort_mode: body.sort_mode,
        slug: body.slug,
        selection_mode: body.selection_mode,
        view_mode: body.view_mode,
      },
    });
  }

  ////

  async createSectionFilters(
    sectionFilters: ({ section_id: number } & SectionMovieFilter)[],
    tx: TransactionType,
  ) {
    await tx.sectionFilter.createMany({
      data: sectionFilters,
    });
  }

  async deleteSectionFilters(sectionId: number, tx: TransactionType) {
    await tx.sectionFilter.deleteMany({
      where: {
        section_id: sectionId,
      },
    });
  }

  async deleteSectionFilter(filterId: number, tx: TransactionType) {
    await tx.sectionFilter.delete({
      where: {
        id: filterId,
      },
    });
  }
}
