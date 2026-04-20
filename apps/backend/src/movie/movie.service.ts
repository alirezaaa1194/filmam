import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto, DeleteMoviesDto } from './dto/movie.dto';
import { MovieRepository } from './repository/movie.repository';
import { MovieFileService } from '../movie-file/movie-file.service';
import { MovieTranslationService } from '../movie-translation/movie-translation.service';
import {
  AppLanguage,
  CommentEntityType,
  MovieFileType,
  MovieType,
  UserMovieType,
} from '@prisma/client';
import { MovieFactorService } from '../movie-factor/movie-factor.service';
import { MovieGenreService } from '../movie-genre/movie-genre.service';
import {
  calculateMovieUserActivityCounts,
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import { MovieFilterInput } from './entity/movie.entity';
import { SortType, SortByType } from '../common/enums';
import { MovieCountryService } from '../movie-country/movie-country.service';
import { MovieLanguageService } from '../movie-language/movie-language.service';
import { UserMovieService } from '../user-movie/user-movie.service';
import { UpdateUserMoviesDto } from '../user-movie/dto/user-movie.dto';
import { MovieTagService } from '../movie-tag/movie-tag.service';
import { prisma } from '../lib/prisma';

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
    private userMovieService: UserMovieService,
    private movieTagService: MovieTagService,
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

  async getMovieDetailAdmin(movieId: number) {
    const movie = await this.movieRepository.getMovieDetailAdmin(movieId);
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
      const movieUserActivities =
        await this.userMovieService.getMovieUserActivities([movie.id]);
      const movieUserActivitiesCounts = calculateMovieUserActivityCounts(
        movieUserActivities,
        movie.id,
      );
      return normalizeMovieDetail({
        ...movie,
        ...movieUserActivitiesCounts,
      });
    }
  }

  async getAllMovies(filter: MovieFilterInput) {
    const where: {
      translations?: any;
      genres?: any;
      countries?: any;
      languages?: any;
      type?: any;
      age_limit?: any;
      tags?: any;
    } = {};
    const pagination: { take: number; skip: number } = {
      skip: 0,
      take: 0,
    };
    let sort: any = {};

    if (filter.search) {
      where.translations = {
        some: {
          title: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
      };
    }

    if (filter.sort_by) {
      if (filter.sort_by === SortByType.CREATED_AT) {
        sort.created_at = filter.sort_order === SortType.ASC ? 'asc' : 'desc';
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
    );

    const movieIds = movies.map((movie) => movie.id);

    const movieUserActivities =
      await this.userMovieService.getMovieUserActivities(
        movieIds,
        CommentEntityType.MOVIE,
      );

    const updatedMovies = movies.map((movie) => {
      const movieUserActivityCounts = calculateMovieUserActivityCounts(
        movieUserActivities,
        movie.id,
      );

      return normalizeMovieDetail({ ...movie, ...movieUserActivityCounts });
    });

    const sortedMoviesByLikesOrWatches =
      filter.sort_by === SortByType.LIKES
        ? updatedMovies.sort((a, b) =>
            filter.sort_order === SortType.ASC
              ? a.likes_counts - b.likes_counts
              : b.likes_counts - a.likes_counts,
          )
        : filter.sort_by === SortByType.WATCHES
          ? updatedMovies.sort((a, b) =>
              filter.sort_order === SortType.ASC
                ? a.watches_counts - b.watches_counts
                : b.watches_counts - a.watches_counts,
            )
          : updatedMovies;

    const allMoviesCount = await this.movieRepository.getAllMoviesCount(where);
    return {
      page: page + 1,
      page_size,
      count: allMoviesCount,
      data: sortedMoviesByLikesOrWatches,
    };
  }

  async updateUserMovies(body: UpdateUserMoviesDto, user_id: number) {
    if (
      (!body.movie_id && !body.episode_id) ||
      (body.movie_id && body.episode_id)
    ) {
      throw new BadRequestException(
        'one of movie_id or episode_id is required',
      );
    }
    if (body.type === UserMovieType.WATCHING && !body.progress_time) {
      throw new BadRequestException('progress time is required');
    }

    return await this.userMovieService.updateUserMovies(body, user_id);
  }

  async deleteUserMovie(actionId: number) {
    return await this.userMovieService.deleteUserMovie(actionId);
  }

  async getUserMovieActions(
    userId: number,
    entityType: CommentEntityType,
    entityId: number,
  ) {
    return await this.userMovieService.getUserMovieActions(
      userId,
      entityType,
      entityId,
    );
  }
}
