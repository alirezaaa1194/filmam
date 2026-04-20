import { AppLanguage, MovieType } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { TransactionType } from '../../common/types/types';

export class MovieRepository {
  async createMovieAdmin(
    body: {
      type: MovieType;
      released_year: number;
      slug: string;
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

  async getMovieDetailAdmin(movieId: number) {
    return await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
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
      },
    });
  }

  async getAllMovies(
    where: any,
    orderBy: any,
    lang: AppLanguage,
    pagination: { take: number; skip: number },
  ) {
    return await prisma.movie.findMany({
      include: {
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
}
