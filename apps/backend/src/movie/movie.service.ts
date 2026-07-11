import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMovieDto, DeleteMoviesDto } from './dto/movie.dto';
import { MovieRepository } from './repository/movie.repository';
import { MovieFileService } from '../movie-file/movie-file.service';
import { MovieTranslationService } from '../movie-translation/movie-translation.service';
import {
  AppLanguage,
  CommentEntityType,
  Movie,
  MovieFileType,
  MovieType,
  SectionSelectionMode,
} from '../generated/prisma';
import { MovieFactorService } from '../movie-factor/movie-factor.service';
import { MovieGenreService } from '../movie-genre/movie-genre.service';
import {
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import { MovieFilterInput } from './entity/movie.entity';
import { SortType, SortByType } from '../common/enums';
import { MovieCountryService } from '../movie-country/movie-country.service';
import { MovieLanguageService } from '../movie-language/movie-language.service';
import { MovieTagService } from '../movie-tag/movie-tag.service';
import { prisma } from '../lib/prisma';
import { SectionService } from '../section/section.service';
import { TransactionType } from '../common/types/types';
import { TfIdf } from '../lib/tfidf';

@Injectable()
export class MovieService {
  constructor(
    private movieRepository: MovieRepository,
    private movieTranslationService: MovieTranslationService,
    private movieFileService: MovieFileService,
    private movieFactorService: MovieFactorService,
    private movieGenreService: MovieGenreService,
    private movieCountryService: MovieCountryService,
    private movieLanguageService: MovieLanguageService,
    private movieTagService: MovieTagService,
    private sectionService: SectionService,
  ) {}

  async createMovieAdmin(body: CreateMovieDto) {
    const {
      files,
      translations,
      factors,
      genres,
      countries,
      languages,
      tags,
      ...otherMovieData
    } = body;
    const movieFilms = files.filter(
      (file) => file.upload_type === MovieFileType.FILM,
    );
    if (
      otherMovieData.type === MovieType.CINEMATIC &&
      (!movieFilms.length || movieFilms.length > 1)
    ) {
      throw new BadRequestException('Movie must take one Film');
    } else if (otherMovieData.type === MovieType.SERIES && movieFilms.length) {
      throw new BadRequestException(
        'Movie with type Series must not take Film',
      );
    }

    if (
      otherMovieData.type === MovieType.CINEMATIC &&
      (typeof movieFilms[0].intro_start_time !== 'number' ||
        typeof movieFilms[0].intro_duration !== 'number' ||
        typeof movieFilms[0].outro_duration !== 'number')
    ) {
      throw new BadRequestException('Intro or outro information is not valid');
    }

    const moviePosters = files.filter(
      (file) => file.upload_type === MovieFileType.POSTER,
    );
    if (!moviePosters.length || moviePosters.length > 1) {
      throw new BadRequestException('Movie must take one Poster');
    }

    const movieThumbnail = files.filter(
      (file) => file.upload_type === MovieFileType.THUMBNAIL,
    );
    if (!movieThumbnail.length || movieThumbnail.length > 1) {
      throw new BadRequestException('Movie must take one Thumbnail');
    }

    const result = prisma.$transaction(async (tx) => {
      const createdMovie = await this.movieRepository.createMovieAdmin(
        otherMovieData,
        tx,
      );
      await this.movieTranslationService.createMovieTranslations(
        translations,
        createdMovie.id,
        tx,
      );
      await this.movieFactorService.createMovieFactors(
        factors,
        createdMovie.id,
        tx,
      );
      await this.movieGenreService.createMovieGenres(
        genres,
        createdMovie.id,
        tx,
      );
      await this.movieCountryService.createMovieCountries(
        countries,
        createdMovie.id,
        tx,
      );
      await this.movieLanguageService.createMovieLanguages(
        languages,
        createdMovie.id,
        tx,
      );
      await this.movieTagService.createMovieTags(tags, createdMovie.id, tx);
      return await this.movieFileService.createMovieFiles(
        files,
        createdMovie.id,
        tx,
      );
    });

    return result;
  }

  async deleteMoviesAdmin(body: DeleteMoviesDto) {
    return await this.movieRepository.deleteMoviesAdmin(body.movie_ids);
  }

  async updateMovieAdmin(body: CreateMovieDto, movieId: number) {
    const {
      files,
      translations,
      factors,
      genres,
      countries,
      languages,
      tags,
      ...otherMovieData
    } = body;
    const movieFilms = files.filter(
      (file) => file.upload_type === MovieFileType.FILM,
    );
    if (
      otherMovieData.type === MovieType.CINEMATIC &&
      (!movieFilms.length || movieFilms.length > 1)
    ) {
      throw new BadRequestException('Movie must take one Film');
    } else if (otherMovieData.type === MovieType.SERIES && movieFilms.length) {
      throw new BadRequestException(
        'Movie with type Series must not take Film',
      );
    }

    const moviePosters = files.filter(
      (file) => file.upload_type === MovieFileType.POSTER,
    );
    if (!moviePosters.length || moviePosters.length > 1) {
      throw new BadRequestException('Movie must take one Poster');
    }

    const movieThumbnail = files.filter(
      (file) => file.upload_type === MovieFileType.THUMBNAIL,
    );
    if (!movieThumbnail.length || movieThumbnail.length > 1) {
      throw new BadRequestException('Movie must take one Thumbnail');
    }

    const result = prisma.$transaction(async (tx) => {
      await this.movieRepository.updateMovieAdmin(otherMovieData, movieId);
      await this.movieTranslationService.updateMovieTranslation(
        translations,
        movieId,
        tx,
      );
      await this.movieFactorService.updateMovieFactors(factors, movieId, tx);
      await this.movieGenreService.updateMovieGenres(genres, movieId, tx);
      await this.movieCountryService.updateMovieCountries(
        countries,
        movieId,
        tx,
      );
      await this.movieLanguageService.updateMovieLanguages(
        languages,
        movieId,
        tx,
      );
      await this.movieTagService.updateMovieTags(tags, movieId, tx);
      return await this.movieFileService.updateMovieFiles(files, movieId, tx);
    });
    return result;
  }

  async getMovieDetailAdmin(movieId: number, tx?: TransactionType) {
    const movie = await this.movieRepository.getMovieDetailAdmin(movieId, tx);
    if (movie) {
      const { factors, genres, files, ...otherMovieData } = movie;

      const movieFactors = factors.map((movieFactor) => {
        const { factor, role } = movieFactor;
        const { files, ...otherFactorData } = factor;
        const factorProfile = {
          ...factor.files[0].upload,
          type: factor.files[0].type,
        };
        return {
          ...otherFactorData,
          type: role.type,
          slug: role.slug,
          profile: factorProfile,
        };
      });

      const movieGenres = genres.map((movieGenre) => {
        const { genre } = movieGenre;
        return genre;
      });

      const movieFiles = files.map((movieFile) => {
        const { upload, type } = movieFile;
        return { ...upload, type };
      });

      return {
        ...otherMovieData,
        factors: movieFactors,
        genres: movieGenres,
        files: movieFiles,
      };
    }
  }

  async getMovieDetailPublic(slug: string, lang: AppLanguage = defaultLang) {
    const movie = await this.movieRepository.getMovieDetailPublic(slug, lang);
    if (movie) {
      return normalizeMovieDetail({
        ...movie,
      });
    }
  }

  async getAllMovies(filter: MovieFilterInput, userId?: number) {
    const result = await prisma.$transaction(async (tx) => {
      const where: {
        translations?: any;
        genres?: any;
        countries?: any;
        languages?: any;
        type?: any;
        age_limit?: any;
        tags?: any;
        released_year?: any;
        user_movies?: any;
        section_movies?: any;
        factors?: any;
        OR?: any;
        NOT?: any;
      } = {};
      const pagination: { take: number; skip: number } = {
        skip: 0,
        take: 0,
      };

      let sort: any = {};

      if (filter.search) {
        const searchTerms = filter.search?.trim().split(/\s+/) ?? [];
        where.OR = [
          {
            translations: {
              some: {
                OR: [
                  {
                    title: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    description: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    short_description: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
          {
            factors: {
              some: {
                factor: {
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
                },
              },
            },
          },
          {
            genres: {
              some: {
                genre: {
                  translations: {
                    some: {
                      name: {
                        contains: filter.search,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
            },
          },
        ];
      }

      if (filter.sort_by) {
        if (filter.sort_by === SortByType.CREATED_AT) {
          sort.created_at = filter.sort_order === SortType.ASC ? 'asc' : 'desc';
        } else if (filter.sort_by === SortByType.LIKES) {
          sort.likes_count =
            filter.sort_order === SortType.ASC ? 'asc' : 'desc';
        } else if (filter.sort_by === SortByType.WATCHES) {
          sort.watches_count =
            filter.sort_order === SortType.ASC ? 'asc' : 'desc';
        }
      } else {
        sort.created_at = filter.sort_order === SortType.ASC ? 'asc' : 'desc';
      }

      if (filter.genres && filter.genres.length) {
        where.genres = {
          some: {
            genre_id: {
              in: filter.genres,
            },
          },
        };
      }

      if (filter.tags && filter.tags.length) {
        where.tags = {
          some: {
            tag_id: {
              in: filter.tags,
            },
          },
        };
      }

      if (filter.countries && filter.countries.length) {
        where.countries = {
          some: {
            country_id: {
              in: filter.countries,
            },
          },
        };
      }

      if (filter.languages && filter.languages.length) {
        where.languages = {
          some: {
            language_id: {
              in: filter.languages,
            },
          },
        };
      }

      if (filter.type) {
        where.type = filter.type;
      }

      if (filter.age_limits && filter.age_limits.length) {
        where.age_limit = {
          in: filter.age_limits,
        };
      }

      if (filter.released_year_from && filter.released_year_to) {
        where.released_year = {
          gte: +filter.released_year_from,
          lte: +filter.released_year_to,
        };
      }

      let sectionSelectionMode: SectionSelectionMode | null = null;

      if (filter.section) {
        const section = await this.sectionService.getSectionDetailPublic(
          filter.section,
          tx,
        );

        if (section) {
          sectionSelectionMode = section.selection_mode;

          if (
            section.selection_mode === SectionSelectionMode.USER_MOVIE &&
            userId
          ) {
            where.user_movies = {
              some: {
                user_id: userId,
              },
            };
          } else if (section.selection_mode === SectionSelectionMode.MANUAL) {
            where.section_movies = {
              some: {
                section: {
                  slug: filter.section,
                },
              },
            };
          } else if (
            section.selection_mode === SectionSelectionMode.SUGGESTION &&
            userId
          ) {
            where.NOT = {
              user_movies: {
                some: {
                  user_id: userId,
                  type: {
                    in: [
                      'WATCHED',
                      'WATCHING',
                      'BOOKMARK',
                      'LIKE',
                      'DISLIKE',
                      'NOTIFICATION',
                    ],
                  },
                },
              },
            };
          }
        }
      }

      const { page, page_size } = paginationCalculator(
        filter.page || 1,
        filter.page_size || 10,
      );

      pagination.skip = page;
      pagination.take = page_size;

      const movies = await this.movieRepository.getAllMovies(
        where,
        sort,
        filter.lang || defaultLang,
        pagination,
        tx,
      );

      const updatedMovies = movies.map((movie) => {
        return normalizeMovieDetail({ ...movie });
      });

      const allMoviesCount =
        await this.movieRepository.getAllMoviesCount(where);

      if (filter.section) {
        if (
          sectionSelectionMode === SectionSelectionMode.SUGGESTION &&
          userId
        ) {
          const userRecentMovies = await tx.userMovie.findMany({
            where: {
              user_id: userId,
              type: {
                in: ['WATCHED', 'WATCHING', 'BOOKMARK', 'LIKE', 'NOTIFICATION'],
              },
            },
            include: { movie: true },
          });

          const allUserRecentMovies = userRecentMovies
            .filter((urm) => urm.entity_type === CommentEntityType.MOVIE)
            .map((urm) => urm.movie);

          const allMoviesWithCurrent = [
            ...allUserRecentMovies,
            ...updatedMovies,
          ].filter((movie) => movie !== null);

          const tfidf = new TfIdf();

          allMoviesWithCurrent.forEach((movie) => {
            tfidf.addDocument(movie.combined_tags);
          });

          const terms = allUserRecentMovies
            .map((urm) => urm?.combined_tags)
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
                movie: allMoviesWithCurrent[i],
                score,
              });
            }
          }

          const allSimilarMovies = similarMovies
            .sort((a, b) => b.score - a.score)
            .map((item) => item.movie);

          return {
            page: page + 1,
            page_size,
            count: allMoviesCount,
            data: allSimilarMovies,
          };
        }
      }

      return {
        page: page + 1,
        page_size,
        count: allMoviesCount,
        data: updatedMovies,
      };
    });

    return result;
  }

  async getRecommendedMovies(
    movieSlug: string,
    lang: AppLanguage = defaultLang,
  ) {
    try {
      const currentMovie = await this.movieRepository.getMovieDetailPublic(
        movieSlug,
        lang,
      );

      if (!currentMovie || !currentMovie.combined_tags) {
        return [];
      }

      const allMovies = await prisma.movie.findMany({
        where: { slug: { not: movieSlug } },
        include: {
          translations: { where: { language: lang } },
          files: { include: { upload: true } },
        },
      });

      if (allMovies.length === 0) return [];

      const allMoviesWithCurrent = [currentMovie, ...allMovies].filter(
        (movie) => movie !== null,
      );
      const normalizedMovies = allMoviesWithCurrent.map((movie) =>
        normalizeMovieDetail(movie),
      );

      const tfidf = new TfIdf();

      normalizedMovies.forEach((movie) => {
        tfidf.addDocument(movie.combined_tags);
      });

      const terms = currentMovie.combined_tags.split(' ');
      let similarMovies: { movie: Movie; score: number }[] = [];

      for (let i = 1; i < normalizedMovies.length; i++) {
        let score = 0;
        terms.forEach((term) => {
          const tfidf1 = tfidf.tfidf(term, 0);
          const tfidf2 = tfidf.tfidf(term, i);
          score += tfidf1 * tfidf2;
        });

        if (score > 0) {
          similarMovies.push({
            movie: normalizedMovies[i],
            score,
          });
        }
      }

      return similarMovies
        .sort((a, b) => b.score - a.score)
        .slice(0, 15)
        .map((item) => item.movie);
    } catch (err) {
      console.error('Error in getRecommendedMovies:', err);
      return [];
    }
  }
}
