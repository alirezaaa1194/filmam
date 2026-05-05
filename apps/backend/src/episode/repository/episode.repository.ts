import { Injectable } from '@nestjs/common';
import {
  RepositoryPaginationQueryProps,
  TransactionType,
} from '../../common/types/types';
import { CreateEpisodeRepositoryProps } from '../type/episode.type';
import { prisma } from '../../lib/prisma';
import { AppLanguage } from '@prisma/client';
import { defaultLang } from '../../lib/utils';

@Injectable()
export class EpisodeRepository {
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
  ) {
    return await prisma.episode.findUnique({
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
}
