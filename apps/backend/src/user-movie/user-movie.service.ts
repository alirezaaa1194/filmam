import { Body, Injectable } from '@nestjs/common';
import { UserMovieRepository } from './repository/user-movie.repository';
import { UpdateUserMoviesDto } from './dto/user-movie.dto';
import { CommentEntityType, UserMovieType } from '@prisma/client';
import { GetAllUserMovieDto } from '../user/dto/user.dto';
import {
  calculateMovieUserActivityCounts,
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import { GetUserMovieByTypeBodyType } from './type/user-movie.type';

@Injectable()
export class UserMovieService {
  constructor(private userMovieRepository: UserMovieRepository) {}

  async hasUserDidAction(body: GetUserMovieByTypeBodyType, userId: number) {
    return await this.userMovieRepository.getUserMovieByType(body, userId);
  }

  async deleteUserMovie(actionId: number) {
    return await this.userMovieRepository.deleteUserMovie(actionId);
  }

  async handleLikeAction(
    body: UpdateUserMoviesDto,
    userId: number,
    type: 'LIKE' | 'DISLIKE',
  ) {
    return await this.userMovieRepository.deleteUserLikedMovies(
      body,
      userId,
      type,
    );
  }

  async updateUserMovies(body: UpdateUserMoviesDto, userId: number) {
    const hasUserDidAction = await this.hasUserDidAction(
      {
        ...body,
        type:
          body.type === 'WATCHED' || body.type === 'WATCHING'
            ? ['WATCHED', 'WATCHING']
            : [body.type],
      },
      userId,
    );
    switch (body.type) {
      case 'BOOKMARK': {
        if (hasUserDidAction) {
          return await this.deleteUserMovie(hasUserDidAction.id);
        } else {
          return await this.userMovieRepository.createUserMovie(body, userId);
        }
      }

      case 'LIKE': {
        if (hasUserDidAction) {
          return await this.deleteUserMovie(hasUserDidAction.id);
        } else {
          await this.handleLikeAction(body, userId, 'DISLIKE');
          return await this.userMovieRepository.createUserMovie(body, userId);
        }
      }

      case 'DISLIKE': {
        if (hasUserDidAction) {
          return this.deleteUserMovie(hasUserDidAction.id);
        } else {
          await this.handleLikeAction(body, userId, 'LIKE');
          return await this.userMovieRepository.createUserMovie(body, userId);
        }
      }

      case 'WATCHED':
      case 'WATCHING': {
        if (hasUserDidAction) {
          return await this.userMovieRepository.updateUserMovie(
            hasUserDidAction.id,
            body,
          );
        } else {
          return await this.userMovieRepository.createUserMovie(body, userId);
        }
      }
    }
  }

  async getUserMovieActions(
    userId: number,
    entityType: CommentEntityType,
    entityId: number,
  ) {
    return await this.userMovieRepository.getUserMovieActions(
      userId,
      entityType,
      entityId,
    );
  }

  async getAllUserMovies(userId: number, query: GetAllUserMovieDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );

    const allUserMovies = await this.userMovieRepository.getAllUserMovies(
      userId,
      query.type,
      page,
      page_size,
      query.lang || defaultLang,
    );

    /////////////////////////////
    // Episodes:
    const episodes = allUserMovies.filter(
      (userMovie) => userMovie.entity_type === CommentEntityType.EPISODE,
    );
    const episodesIds = episodes
      .map((userMovieEpisode) => userMovieEpisode.episode?.id)
      .filter((episodeId) => episodeId !== undefined);

    const episodesUserActivities = await this.getMovieUserActivities(
      episodesIds,
      CommentEntityType.EPISODE,
    );

    const updatedEpisodes = episodes.map((userMovie) => {
      const { episode, ...otherUserMovieData } = userMovie;
      const episodesActivityInfo = calculateMovieUserActivityCounts(
        episodesUserActivities,
        episode?.id ?? 0,
        CommentEntityType.EPISODE,
      );

      return {
        ...otherUserMovieData,
        episode: { ...episode, ...episodesActivityInfo },
      };
    });

    /////////////////////////////
    // Movies:
    const movies = allUserMovies.filter(
      (userMovie) => userMovie.entity_type === CommentEntityType.MOVIE,
    );
    const movieIds = movies
      .map((userMovie) => userMovie.movie?.id)
      .filter((movieId) => movieId !== undefined);
    const movieUserActivities = await this.getMovieUserActivities(
      movieIds,
      CommentEntityType.MOVIE,
    );

    const normalizedUserMovies = movies.map((userMovie) => {
      const { movie, ...otherUserMovieData } = userMovie;
      const normalizedMovie = normalizeMovieDetail(movie);
      const movieActivityInfo = calculateMovieUserActivityCounts(
        movieUserActivities,
        movie?.id ?? 0,
        CommentEntityType.MOVIE,
      );

      return {
        ...otherUserMovieData,
        movie: { ...normalizedMovie, ...movieActivityInfo },
      };
    });

    const userMoviesCount = await this.userMovieRepository.getUserMoviesCount(
      userId,
      query.type,
    );

    return {
      page: page + 1,
      page_size,
      count: userMoviesCount,
      data: [...updatedEpisodes, ...normalizedUserMovies],
    };
  }

  async getMovieUserActivities(
    entityIds: number[],
    entityType: CommentEntityType = CommentEntityType.MOVIE,
  ) {
    return await this.userMovieRepository.getMovieUserActivities(
      entityIds,
      entityType,
    );
  }
}
