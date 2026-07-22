import { Injectable } from '@nestjs/common';
import {
  RepositoryPaginationQueryProps,
  TransactionType,
} from '../../common/types/types';
import { CreateEpisodeRepositoryProps } from '../type/episode.type';
import { prisma } from '../../lib/prisma';
import { AppLanguage, UserMovieType } from '../../generated/prisma';
import { defaultLang } from '../../lib/utils';

@Injectable()
export class EpisodeRepository {
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

  async findNotificationUserMovies(movieId: number) {
    return await prisma.userMovie.findMany({
      where: {
        type: UserMovieType.NOTIFICATION,
        movie_id: movieId,
      },
    });
  }

  async createEpisode(body: CreateEpisodeRepositoryProps, tx: TransactionType) {
    return await tx.episode.create({
      data: body,
    });
  }

  async updateEpisode(
    body: CreateEpisodeRepositoryProps,
    episode_id: number,
    tx: TransactionType,
  ) {
    return await tx.episode.update({
      where: { id: episode_id },
      data: body,
    });
  }

  async deleteEpisodes(episodeIds: number[], tx: TransactionType) {
    return await tx.episode.deleteMany({
      where: {
        id: {
          in: episodeIds,
        },
      },
    });
  }

  async getEpisodeDetailAdmin(episodeId: number, tx?: TransactionType) {
    return await (tx ? tx : prisma).episode.findUnique({
      where: { id: episodeId },
      include: {
        translations: true,
        files: {
          select: {
            upload: true,
            type: true,
          },
        },
      },
    });
  }

  async getEpisodeDetailPublic(
    episodeSlug: string,
    lang: AppLanguage = defaultLang,
    tx: TransactionType,
  ) {
    return await tx.episode.findUnique({
      where: { slug: episodeSlug },
      include: {
        translations: {
          where: {
            language: lang,
          },
        },
        movie: {
          include: {
            _count: {
              select: {
                seasons: true,
                episodes: true,
              },
            },
            translations: {
              where: {
                language: lang,
              },
            },
            genres: {
              include: {
                genre: {
                  include: {
                    translations: {
                      where: {
                        language: lang,
                      },
                    },
                  },
                },
              },
            },
            languages: {
              include: {
                language: {
                  include: {
                    translations: {
                      where: {
                        lang: lang,
                      },
                    },
                  },
                },
              },
            },
            countries: {
              include: {
                country: {
                  include: {
                    translations: {
                      where: {
                        language: lang,
                      },
                    },
                  },
                },
              },
            },
            factors: {
              include: {
                role: {
                  include: {
                    translations: {
                      where: {
                        language: lang,
                      },
                    },
                  },
                },
                factor: {
                  include: {
                    translations: {
                      where: {
                        language: lang,
                      },
                    },
                    movie_factors: {
                      include: {
                        translations: {
                          where: {
                            language: lang,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            files: {
              select: {
                upload: true,
                type: true,
              },
            },
            seasons: {
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
        },
        season: {
          include: {
            translations: {
              where: {
                language: lang,
              },
            },
          },
        },
        files: {
          select: {
            upload: true,
            type: true,
            intro_start_time: true,
            intro_duration: true,
            outro_duration: true,
          },
        },
      },
    });
  }

  async getEpisodesCount(search: string = '') {
    return await prisma.episode.count({
      where: {
        OR: [
          {
            translations: {
              some: {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            movie: {
              translations: {
                some: {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            season: {
              translations: {
                some: {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },
    });
  }

  async getAllEpisodes(query: RepositoryPaginationQueryProps) {
    return await prisma.episode.findMany({
      include: {
        translations: {
          where: {
            language: query.lang,
          },
          select: { title: true },
        },
        movie: {
          select: {
            _count: {
              select: {
                seasons: true,
              },
            },
            translations: {
              where: {
                language: query.lang,
              },
              select: { title: true },
            },
          },
        },
        season: {
          select: {
            translations: {
              where: {
                language: query.lang,
              },
              select: { title: true },
            },
          },
        },
        files: {
          select: {
            intro_start_time: true,
            intro_duration: true,
            outro_duration: true,
            upload: true,
            type: true,
          },
        },
      },
      skip: query.page,
      take: query.page_size,
      where: {
        OR: [
          {
            translations: {
              some: {
                title: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
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
          },
          {
            season: {
              translations: {
                some: {
                  title: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },
      orderBy: {
        created_at: query.sort_type,
      },
    });
  }

  async getNextEpisode(
    currentEpisodeOrder: number,
    currentEpisodeSeasonOrder: number,
    lang: AppLanguage = defaultLang,
    tx: TransactionType,
  ) {
    const nextEpisode = await tx.episode.findFirst({
      where: {
        order: currentEpisodeOrder + 1,
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
        season: {
          include: {
            translations: {
              where: {
                language: lang,
              },
            },
          },
        },
      },
    });

    if (nextEpisode) {
      return nextEpisode;
    }

    return await this.getNextSeasonFirstEpisode(
      currentEpisodeSeasonOrder,
      lang,
      tx,
    );
  }

  async getNextSeasonFirstEpisode(
    currentEpisodeSeasonOrder: number,
    lang: AppLanguage,
    tx: TransactionType,
  ) {
    return await tx.episode.findFirst({
      where: {
        order: 1,
        season: { order: currentEpisodeSeasonOrder + 1 },
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
        season: {
          include: {
            translations: {
              where: {
                language: lang,
              },
            },
          },
        },
      },
    });
  }
}
