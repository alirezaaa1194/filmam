import { Injectable } from '@nestjs/common';
import {
  RepositoryPaginationQueryProps,
  TransactionType,
} from '../../common/types/types';
import { CreateSeasonRepositoryProps } from '../type/season.type';
import { prisma } from '../../lib/prisma';

@Injectable()
export class SeasonRepository {
  async findSeasonWithMovie(seasonId: number, tx?: TransactionType) {
    return await (tx ? tx : prisma).season.findUnique({
      where: { id: seasonId },
      include: {
        movie: {
          include: { translations: true },
        },
      },
    });
  }

  async createSeason(body: CreateSeasonRepositoryProps, tx: TransactionType) {
    return await tx.season.create({
      data: body,
    });
  }

  async updateSeason(
    body: CreateSeasonRepositoryProps,
    season_id: number,
    tx: TransactionType,
  ) {
    return await tx.season.update({
      where: { id: season_id },
      data: body,
    });
  }

  async deleteSeasons(seasonIds: number[], tx: TransactionType) {
    return await tx.season.deleteMany({
      where: {
        id: {
          in: seasonIds,
        },
      },
    });
  }

  async getSeasonDetail(seasonId: number, tx?: TransactionType) {
    return await (tx ? tx : prisma).season.findUnique({
      where: { id: seasonId },
      include: {
        translations: true,
        movie: {
          select: {
            translations: {
              select: { title: true },
            },
          },
        },
        files: {
          select: {
            upload: true,
            type: true,
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
    });
  }

  async getSeasonsCount(search: string = '', movie_id?: number | null) {
    return await prisma.season.count({
      where: {
        translations: {
          some: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        movie_id: movie_id || undefined,
      },
    });
  }

  async getAllSeasons(query: RepositoryPaginationQueryProps) {
    return await prisma.season.findMany({
      include: {
        translations: {
          where: {
            language: query.lang,
          },
          select: { title: true },
        },
        files: {
          select: {
            upload: true,
            type: true,
          },
        },
        movie: {
          select: {
            translations: {
              where: {
                language: query.lang,
              },
              select: { title: true },
            },
          },
        },
        _count: {
          select: {
            episodes: true,
          },
        },
      },
      skip: query.page,
      take: query.page_size,
      where: {
        translations: {
          some: {
            title: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
        movie: {
          translations: {
            some: {
              title: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
        movie_id: query.movie_id || undefined,
      },
      orderBy: {
        created_at: query.sort_type,
      },
    });
  }

  async getSeasonEpisodes(
    query: RepositoryPaginationQueryProps,
    seasonSlug: string,
  ) {
    return await prisma.episode.findMany({
      where: { season: { slug: seasonSlug } },
      skip: query.page,
      take: query.page_size,
      include: {
        translations: {
          where: { language: query.lang },
          select: { title: true },
        },
        season: {
          select: {
            translations: {
              where: { language: query.lang },
              select: { title: true },
            },
          },
        },
        movie: {
          select: {
            translations: {
              where: { language: query.lang },
              select: { title: true },
            },
            _count: {
              select: {
                seasons: true,
              },
            },
          },
        },
        files: {
          include: { upload: true },
        },
      },
      orderBy: {
        order: query.sort_type,
      },
    });
  }

  async getSeasonEpisodesCount(seasonSlug: string) {
    return await prisma.episode.count({
      where: { season: { slug: seasonSlug } },
    });
  }
}
