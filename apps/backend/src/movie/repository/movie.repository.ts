import { AppLanguage, MovieType } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { TransactionType } from '../../common/types/types';

export class MovieRepository {
  async createMovieAdmin(
    body: {
      type: MovieType;
      released_year: number;
      slug: string;
      combined_tags: string;
    },
    tx: TransactionType,
  ) {
    return await tx.movie.create({ data: body });
  }

  async deleteMoviesAdmin(movieIds: number[]) {
    return await prisma.movie.deleteMany({
      where: {
        id: {
          in: movieIds,
        },
      },
    });
  }

  async updateMovieAdmin(
    body: {
      type: MovieType;
      slug: string;
    },
    movieId: number,
  ) {
    return await prisma.movie.updateMany({
      data: body,
      where: {
        id: movieId,
      },
    });
  }

  async getMovieDetailAdmin(movieId: number, tx?: TransactionType) {
    return await (tx ? tx : prisma).movie.findUnique({
      where: { id: movieId },
      include: {
        _count: {
          select: {
            seasons: true,
            episodes: true,
          },
        },
        seasons: true,
        episodes: true,
        translations: true,
        factors: {
          orderBy: {
            order: 'desc',
          },
          include: {
            role: true,
            factor: {
              include: {
                translations: true,
                files: {
                  include: {
                    upload: true,
                  },
                },
              },
            },
            // {
            //   select: {
            //     id: true,
            //     created_at: true,
            //     updated_at: true,
            //     translations: true,
            //   },
            // },
          },
        },
        genres: {
          include: {
            genre: {
              include: {
                translations: true,
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
    });
  }

  async getMovieDetailPublic(slug: string, lang: AppLanguage) {
    return await prisma.movie.findUnique({
      where: { slug },
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
          orderBy: {
            order: 'asc',
          },
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
          orderBy: {
            order: 'asc',
          },
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
    });
  }

  async getAllMovies(
    where: any,
    orderBy: any,
    lang: AppLanguage,
    pagination: { take: number; skip: number },
    tx?: TransactionType,
  ) {
    return await (tx ? tx : prisma).movie.findMany({
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
            intro_start_time: true,
            intro_duration: true,
            outro_duration: true,
          },
        },
      },
      where,
      orderBy,
      ...pagination,
    });
  }

  async getAllMoviesCount(where: any) {
    return await prisma.movie.count({
      where,
    });
  }

  async findMoviesForRecommendation(slug: string, lang: AppLanguage) {
    return await prisma.movie.findMany({
      where: { slug: { not: slug } },
      include: {
        translations: { where: { language: lang } },
        files: { include: { upload: true } },
      },
    });
  }

  async countMoviesByType(type: MovieType) {
    return prisma.movie.count({ where: { type } });
  }

  async countMoviesCreatedBetween(start: Date, end: Date) {
    return prisma.movie.count({
      where: { created_at: { gte: start, lt: end } },
    });
  }
}
