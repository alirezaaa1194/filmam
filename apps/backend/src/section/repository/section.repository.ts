import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import {
  CreateSectionDto,
  SectionMovieFilter,
  UpdateSectionDto,
} from '../dto/section.dto';
import { AppLanguage } from '@prisma/client';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class SectionRepository {
  constructor() {}
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

  async getSectionMoviesPublic(
    slug: string,
    page: number,
    pageSize: number,
    lang: AppLanguage,
  ) {
    return await prisma.movie.findMany({
      where: {
        section_movies: {
          some: {
            section: {
              slug,
            },
          },
        },
      },
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
      skip: page,
      take: pageSize,
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

  async getAllSections(page: number, pageSize: number, lang: AppLanguage) {
    return await prisma.section.findMany({
      skip: page,
      take: pageSize,
      include: {
        section_filters: true,
        translations: {
          where: {
            language: lang,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async deleteSectionsAdmin(sections_ids: number[]) {
    return await prisma.section.deleteMany({
      where: { id: { in: sections_ids } },
    });
  }

  async updateSection(
    body: UpdateSectionDto,
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
