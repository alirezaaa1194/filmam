import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SectionRepository } from './repository/section.repository';
import {
  CreateSectionDto,
  DeleteSectionsDto,
  GetAllSectionsDto,
} from './dto/section.dto';
import { SectionTranslationService } from '../section-translation/section-translation.service';
import { SectionMovieService } from '../section-movie/section-movie.service';
import {
  AppLanguage,
  CommentEntityType,
  Movie,
  MovieType,
  SectionFilterKey,
  SectionMovieViewMode,
  SectionPeriodBase,
  SectionSelectionMode,
  SectionSortMode,
  SectionViewMode,
  UserMovieType,
} from '../generated/prisma';
import { prisma } from '../lib/prisma';
import {
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import { UserMovieService } from '../user-movie/user-movie.service';
import { SortType } from '../common/enums';
import { TfIdf } from '../lib/tfidf';
import { TransactionType } from '../common/types/types';

@Injectable()
export class SectionService {
  constructor(
    private sectionRepository: SectionRepository,
    private sectionTranslationService: SectionTranslationService,
    private sectionMovieService: SectionMovieService,
    private userMovieService: UserMovieService,
  ) {}

  async createSectionAdmin(body: CreateSectionDto) {
    if (
      body.view_mode === SectionViewMode.HERO &&
      body.selection_mode !== SectionSelectionMode.MANUAL
    ) {
      throw new BadRequestException(
        'Hero selection mode must take one Manual mode',
      );
    }
    if (body.view_mode === SectionViewMode.HERO && body.order !== 1) {
      throw new BadRequestException('Hero selection must be on order 1');
    }
    if (body.view_mode === SectionViewMode.KIDS_SLIDER) {
      const withoutDescTranslation = body.translations.some(
        (translation) => !translation.description,
      );
      if (withoutDescTranslation) {
        throw new BadRequestException(
          'kids slider view mode could not take empty description',
        );
      }
    }

    const daysAgo = new Date();
    daysAgo.setDate(
      daysAgo.getDate() -
        (body.period_base === SectionPeriodBase.A_DAY_AGO
          ? 1
          : body.period_base === SectionPeriodBase.A_WEEK_AGO
            ? 7
            : body.period_base === SectionPeriodBase.A_MONTH_AGO
              ? 30
              : 0),
    );

    let moviesIds: any[] = [];
    if (body.selection_mode === SectionSelectionMode.MANUAL) {
      if (body.section_movies && body.section_movies.length) {
        if (body.view_mode === SectionViewMode.PUZZLE) {
          const puzzleItems = body.section_movies.filter(
            (sectionMovie) =>
              sectionMovie.view_mode === SectionMovieViewMode.PUZZLE,
          );

          const sliderItems = body.section_movies.filter(
            (sectionMovie) =>
              sectionMovie.view_mode === SectionMovieViewMode.SLIDER_ITEM,
          );

          if (puzzleItems.length < 4 || puzzleItems.length > 4) {
            throw new BadRequestException(
              'puzzle section puzzle items count must be 4',
            );
          }

          if (!sliderItems.length) {
            throw new BadRequestException(
              'puzzle section slider items are required',
            );
          }
        }
        const hasRepeatedOrders = body.section_movies.some((sm, i) => {
          return body.section_movies?.find(
            (sm2, i2) => sm.order === sm2.order && i !== i2,
          );
        });
        if (hasRepeatedOrders) {
          throw new ConflictException(
            'section movies could not has repeated order',
          );
        }
        moviesIds = body.section_movies;
      } else {
        throw new BadRequestException('movie ids are required');
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdSection = await this.sectionRepository.createSectionAdmin(
        body,
        tx,
      );

      await this.sectionTranslationService.createSectionTranslation(
        body.translations,
        createdSection.id,
        tx,
      );

      if (body.selection_mode === SectionSelectionMode.MANUAL) {
        await this.sectionMovieService.createSectionMovies(
          moviesIds,
          createdSection.id,
          tx,
        );
      } else if (body.selection_mode === SectionSelectionMode.AUTO) {
        const sectionFilters = body.filters.map((sectionFilter) => ({
          section_id: createdSection.id,
          ...sectionFilter,
        }));

        await this.sectionRepository.createSectionFilters(sectionFilters, tx);
      }
    });

    return result;
  }

  async updateSectionAdmin(sectionId: number, body: CreateSectionDto) {
    if (
      body.view_mode === SectionViewMode.HERO &&
      body.selection_mode !== SectionSelectionMode.MANUAL
    ) {
      throw new BadRequestException(
        'Hero selection mode must take one Manual mode',
      );
    }
    if (body.view_mode === SectionViewMode.KIDS_SLIDER) {
      const withoutDescTranslation = body.translations.some(
        (translation) => !translation.description,
      );
      if (withoutDescTranslation) {
        throw new BadRequestException(
          'kids slider view mode could not take empty description',
        );
      }
    }

    const daysAgo = new Date();
    daysAgo.setDate(
      daysAgo.getDate() -
        (body.period_base === SectionPeriodBase.A_DAY_AGO
          ? 1
          : body.period_base === SectionPeriodBase.A_WEEK_AGO
            ? 7
            : body.period_base === SectionPeriodBase.A_MONTH_AGO
              ? 30
              : 0),
    );

    let moviesIds: any[] = [];
    if (body.selection_mode === SectionSelectionMode.MANUAL) {
      if (body.section_movies && body.section_movies.length) {
        if (body.view_mode === SectionViewMode.PUZZLE) {
          const puzzleItems = body.section_movies.filter(
            (sectionMovie) =>
              sectionMovie.view_mode === SectionMovieViewMode.PUZZLE,
          );

          const sliderItems = body.section_movies.filter(
            (sectionMovie) =>
              sectionMovie.view_mode === SectionMovieViewMode.SLIDER_ITEM,
          );

          if (puzzleItems.length < 4 || puzzleItems.length > 4) {
            throw new BadRequestException(
              'puzzle section puzzle items count must be 4',
            );
          }

          if (!sliderItems.length) {
            throw new BadRequestException(
              'puzzle section slider items are required',
            );
          }
        }
        const hasRepeatedOrders = body.section_movies.some((sm, i) => {
          return body.section_movies?.find(
            (sm2, i2) => sm.order === sm2.order && i !== i2,
          );
        });
        if (hasRepeatedOrders) {
          throw new ConflictException(
            'section movies could not has repeated order',
          );
        }
        moviesIds = body.section_movies;
      } else {
        throw new BadRequestException('movie ids are required');
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      await this.sectionRepository.updateSection(body, sectionId, tx);

      await this.sectionTranslationService.deleteSectionTranslations(
        sectionId,
        tx,
      );

      await this.sectionTranslationService.createSectionTranslation(
        body.translations,
        sectionId,
        tx,
      );

      if (body.selection_mode === SectionSelectionMode.MANUAL) {
        await this.sectionMovieService.deleteSectionMovies(sectionId, tx);
        await this.sectionMovieService.createSectionMovies(
          moviesIds,
          sectionId,
          tx,
        );
      } else if (body.selection_mode === SectionSelectionMode.AUTO) {
        await this.sectionRepository.deleteSectionFilters(sectionId, tx);
        const sectionFilters = body.filters.map((sectionFilter) => ({
          section_id: sectionId,
          ...sectionFilter,
        }));

        await this.sectionRepository.createSectionFilters(sectionFilters, tx);
      }
    });

    return result;
  }

  async getAllSections(query: GetAllSectionsDto, userId?: number) {
    const result = await prisma.$transaction(async (tx) => {
      const { page, page_size } = paginationCalculator(
        query.page || 1,
        query.page_size || 10,
      );
      const sections = await this.sectionRepository.getAllSections(
        page,
        page_size,
        query.lang || defaultLang,
        query.search?.trim(),
        query.sort || SortType.ASC,
        tx,
      );

      const normalizedSection = sections.map(async (section) => {
        let movies: any[] = [];
        const { translations, ...otherSectionData } = section;
        const daysAgo = new Date();
        daysAgo.setDate(
          daysAgo.getDate() -
            (otherSectionData.period_base === SectionPeriodBase.A_DAY_AGO
              ? 1
              : otherSectionData.period_base === SectionPeriodBase.A_WEEK_AGO
                ? 7
                : otherSectionData.period_base === SectionPeriodBase.A_MONTH_AGO
                  ? 30
                  : 0),
        );
        if (otherSectionData.selection_mode === SectionSelectionMode.MANUAL) {
          const sectionMovies = await this.sectionRepository.getSectionMovies(
            otherSectionData.id,
            query.lang,
            query.movies_size,
            tx,
          );

          movies = sectionMovies.map((sectionMovie) => {
            if (sectionMovie.entity_type === CommentEntityType.MOVIE) {
              return normalizeMovieDetail({
                ...sectionMovie.movie,
                entity_type: sectionMovie.entity_type,
              });
            } else if (
              sectionMovie.entity_type === CommentEntityType.EPISODE &&
              sectionMovie.episode
            ) {
              const {
                files,
                translations,
                movie,
                season,
                ...otherEpisodeData
              } = sectionMovie.episode;
              const episodeFiles = files.map((file) => {
                return {
                  ...file.upload,
                  type: file.type,
                  intro_start_time: file.intro_start_time,
                  intro_duration: file.intro_duration,
                  outro_duration: file.outro_duration,
                };
              });
              const episodeTranslation = translations[0];

              return {
                ...otherEpisodeData,
                title: episodeTranslation.title,
                entity_type: sectionMovie.entity_type,
                movie_title: movie.translations[0].title,
                season_title: season.translations[0].title,
                files: episodeFiles,
              };
            }
          });

          const sectionTranslation = translations[0];

          return {
            ...{
              ...otherSectionData,
              title: sectionTranslation.title,
              description: sectionTranslation.description,
            },
            movies,
          };
        } else if (
          otherSectionData.selection_mode === SectionSelectionMode.AUTO
        ) {
          otherSectionData.section_filters;
          const hasPeriodBase =
            otherSectionData.period_base === SectionPeriodBase.A_DAY_AGO ||
            otherSectionData.period_base === SectionPeriodBase.A_MONTH_AGO ||
            otherSectionData.period_base === SectionPeriodBase.A_WEEK_AGO;

          const genresFilter = otherSectionData.section_filters
            .filter((sf) => sf.filter_key === SectionFilterKey.GENRES)
            .map((sf) => +sf.filter_value);

          const countriesFilter = otherSectionData.section_filters
            .filter((sf) => sf.filter_key === SectionFilterKey.COUNTRIES)
            .map((sf) => +sf.filter_value);

          const languagesFilter = otherSectionData.section_filters
            .filter((sf) => sf.filter_key === SectionFilterKey.LANGUAGES)
            .map((sf) => +sf.filter_value);

          const tagsFilter = otherSectionData.section_filters
            .filter((sf) => sf.filter_key === SectionFilterKey.TAGS)
            .map((sf) => +sf.filter_value);

          const searchFilter = otherSectionData.section_filters.find(
            (sf) => sf.filter_key === SectionFilterKey.SEARCH,
          );

          const typeFilter = otherSectionData.section_filters.find(
            (sf) => sf.filter_key === SectionFilterKey.TYPE,
          );

          const sectionAgeLimit = otherSectionData.section_filters
            .filter((sf) => sf.filter_key === SectionFilterKey.AGE_LIMITS)
            .sort((a, b) => +a.filter_value - +b.filter_value);

          const hasReleasedYearFromFilter =
            otherSectionData.section_filters.some(
              (sf) => sf.filter_key === SectionFilterKey.RELEASED_YEAR_FROM,
            );
          const hasReleasedYearToFilter = otherSectionData.section_filters.some(
            (sf) => sf.filter_key === SectionFilterKey.RELEASED_YEAR_TO,
          );

          const sectionRelatedMovies = await tx.movie.findMany({
            ...(otherSectionData.sort_mode === SectionSortMode.NEWEST
              ? {
                  orderBy: {
                    created_at: 'desc',
                  },
                }
              : otherSectionData.sort_mode === SectionSortMode.OLDEST
                ? {
                    orderBy: {
                      created_at: 'asc',
                    },
                  }
                : otherSectionData.sort_mode === SectionSortMode.MOST_VIEWED ||
                    otherSectionData.sort_mode === SectionSortMode.TOP_RATED
                  ? {
                      orderBy: {
                        user_movies: {
                          _count: 'desc',
                        },
                      },
                    }
                  : {}),
            where: {
              ...(otherSectionData.sort_mode === SectionSortMode.MOST_VIEWED
                ? {
                    user_movies: {
                      some: {
                        OR: [
                          {
                            type: UserMovieType.WATCHED,
                            ...(hasPeriodBase
                              ? {
                                  updated_at: {
                                    gte: daysAgo,
                                  },
                                }
                              : {}),
                          },
                          {
                            type: UserMovieType.WATCHING,
                            ...(hasPeriodBase
                              ? {
                                  updated_at: {
                                    gte: daysAgo,
                                  },
                                }
                              : {}),
                          },
                        ],
                      },
                    },
                  }
                : otherSectionData.sort_mode === SectionSortMode.TOP_RATED
                  ? {
                      user_movies: {
                        some: {
                          type: UserMovieType.LIKE,
                          ...(hasPeriodBase
                            ? {
                                created_at: {
                                  gte: daysAgo,
                                },
                              }
                            : {}),
                        },
                      },
                    }
                  : otherSectionData.sort_mode === SectionSortMode.TRENDING
                    ? {
                        tags: {
                          some: {
                            tag: {
                              slug: {
                                contains: 'trend',
                                mode: 'insensitive',
                              },
                            },
                          },
                        },
                      }
                    : {}),
              ...(genresFilter.length
                ? {
                    // AND: genresFilter.map((genreId) => ({
                    //   genres: {
                    //     some: {
                    //       genre_id: genreId,
                    //     },
                    //   },
                    // })),
                    genres: {
                      some: {
                        genre_id: {
                          in: genresFilter,
                        },
                      },
                    },
                  }
                : {}),
              ...(countriesFilter.length
                ? {
                    countries: {
                      some: {
                        country_id: {
                          in: countriesFilter,
                        },
                      },
                    },
                  }
                : {}),
              ...(languagesFilter.length
                ? {
                    languages: {
                      some: {
                        language_id: {
                          in: languagesFilter,
                        },
                      },
                    },
                  }
                : {}),
              ...(tagsFilter.length
                ? {
                    tags: {
                      some: {
                        tag_id: {
                          in: tagsFilter,
                        },
                      },
                    },
                  }
                : {}),
              ...(searchFilter
                ? {
                    translations: {
                      some: {
                        title: {
                          contains: searchFilter.filter_value,
                          mode: 'insensitive',
                        },
                      },
                    },
                  }
                : {}),
              ...(typeFilter
                ? {
                    type: typeFilter.filter_value as MovieType,
                  }
                : {}),
              ...(sectionAgeLimit.length
                ? {
                    ...(sectionAgeLimit.length > 1
                      ? {
                          age_limit: {
                            gte: +sectionAgeLimit[0],
                            lt: +sectionAgeLimit[sectionAgeLimit.length - 1],
                          },
                        }
                      : {
                          age_limit: {
                            lte: +sectionAgeLimit[0],
                          },
                        }),
                  }
                : {}),
              ...(hasReleasedYearFromFilter && hasReleasedYearToFilter
                ? {
                    released_year: {
                      gte: +hasReleasedYearFromFilter,
                      lte: +hasReleasedYearToFilter,
                    },
                  }
                : {}),
            },
            include: {
              translations: {
                where: {
                  language: query.lang,
                },
              },
              files: {
                select: {
                  upload: true,
                  type: true,
                },
              },
            },
            take: query.movies_size || 10,
          });

          if (
            otherSectionData.view_mode === SectionViewMode.PUZZLE &&
            sectionRelatedMovies.length < 5
          ) {
            return null;
          }

          movies = sectionRelatedMovies.map((movie, index) => {
            return normalizeMovieDetail({
              ...movie,
              movie_id: movie.id,
              view_mode:
                otherSectionData.view_mode === 'PUZZLE'
                  ? index < 4
                    ? 'PUZZLE'
                    : 'SLIDER_ITEM'
                  : null,
              order: index + 1,
            });
          });
          const sectionTranslation = translations[0];
          return {
            ...otherSectionData,
            title: sectionTranslation.title,
            description: sectionTranslation.description,
            filter: `${[...otherSectionData.section_filters, { filter_key: 'lang', filter_value: query.lang }, { filter_key: 'page', filter_value: 1 }, { filter_key: 'page_size', filter_value: 20 }].map((sf, i) => `${i === 0 ? '?' : '&'}${sf.filter_key.toLowerCase()}=${sf.filter_value}`).join('')}`,
            movies,
          };
        } else if (
          section.selection_mode === SectionSelectionMode.USER_MOVIE &&
          userId
        ) {
          const userRecentMovies = await this.userMovieService.getAllUserMovies(
            userId,
            {
              type: ['WATCHED', 'WATCHING'],
              lang: query.lang,
              page: 1,
              page_size: query.movies_size,
            },
          );
          const sectionTranslation = translations[0];
          return {
            ...{
              ...otherSectionData,
              title: sectionTranslation.title,
              description: sectionTranslation.description,
            },
            movies: userRecentMovies.data,
          };
        } else if (
          section.selection_mode === SectionSelectionMode.SUGGESTION &&
          userId
        ) {
          const userRecentMovies = await this.userMovieService.getAllUserMovies(
            userId,
            {
              type: [
                'WATCHED',
                'WATCHING',
                'BOOKMARK',
                'LIKE',
                'DISLIKE',
                'NOTIFICATION',
              ],
              lang: query.lang,
              page: 1,
              page_size: query.movies_size,
            },
            tx,
          );
          const allUserRecentMovies = userRecentMovies.data
            .filter((urm) => urm.entity_type === CommentEntityType.MOVIE)
            .map((urm) => urm.movie);

          const userRecentMoviesIds = allUserRecentMovies.map(
            (userRecentMovie) => userRecentMovie.id,
          );

          const allMovies = await tx.movie.findMany({
            where: { id: { not: { in: userRecentMoviesIds } } },
            include: {
              translations: { where: { language: query.lang } },
              files: { include: { upload: true } },
            },
          });

          if (allMovies.length === 0) return [];

          const allMoviesWithCurrent = [
            ...allUserRecentMovies,
            ...allMovies,
          ].filter((movie) => movie !== null);

          const tfidf = new TfIdf();

          allMoviesWithCurrent.forEach((movie) => {
            tfidf.addDocument(movie.combined_tags);
          });

          const terms = allUserRecentMovies
            .map((urm) => urm.combined_tags)
            .join(' ')
            .split(' ');
          let similarMovies: { movie: Movie; score: number }[] = [];

          for (
            let i = allUserRecentMovies.length;
            i < allMoviesWithCurrent.length;
            i++
          ) {
            let score = 0;
            terms.forEach((term) => {
              const tfidf1 = tfidf.tfidf(term, 0);
              const tfidf2 = tfidf.tfidf(term, i);
              score += tfidf1 * tfidf2;
            });

            if (score > 0) {
              similarMovies.push({
                movie: normalizeMovieDetail(allMoviesWithCurrent[i]),
                score,
              });
            }
          }

          const allSimilarMovies = similarMovies
            .sort((a, b) => b.score - a.score)
            .slice(0, 15)
            .map((item) => item.movie);

          const sectionTranslation = translations[0];
          return {
            ...{
              ...otherSectionData,
              title: sectionTranslation.title,
              description: sectionTranslation.description,
            },
            movies: allSimilarMovies,
          };
        }
      });
      const sectionsData = await Promise.all(normalizedSection);
      const sectionsCount = await this.sectionRepository.getSectionsCount(
        query.search?.trim(),
        tx,
      );
      return {
        page: page + 1,
        page_size,
        count: sectionsCount,
        data: sectionsData,
      };
    });
    return result;
  }

  async getSectionDetailAdmin(sectionId: number, lang?: AppLanguage) {
    const section = await this.sectionRepository.getSectionDetailAdmin(
      sectionId,
      lang || defaultLang,
    );
    if (section) {
      const { section_movies, ...otherSectionData } = section;
      const normalizedSectionMovies = section_movies.map((sectionMovie) => {
        const { movie } = sectionMovie;
        return normalizeMovieDetail(movie);
      });

      return {
        ...otherSectionData,
        movies: normalizedSectionMovies,
      };
    }
  }

  async getSectionDetailPublic(sectionSlug: string, tx?: TransactionType) {
    return await this.sectionRepository.getSectionDetailPublic(sectionSlug, tx);
  }

  async deleteSectionsAdmin(body: DeleteSectionsDto) {
    return await this.sectionRepository.deleteSectionsAdmin(body.sections_ids);
  }
}
