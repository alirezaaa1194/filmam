import { AppLanguage, CommentEntityType, UserMovieType } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { UpdateUserMoviesDto } from '../dto/user-movie.dto';
import { GetUserMovieByTypeBodyType } from '../type/user-movie.type';

export class UserMovieRepository {
  async getUserMovieByType(body: GetUserMovieByTypeBodyType, userId: number) {
    return await prisma.userMovie.findFirst({
      where: {
        ...(body.entity_type === CommentEntityType.EPISODE
          ? { episode_id: body.episode_id }
          : { movie_id: body.movie_id }),
        user_id: userId,
        type: { in: body.type },
      },
    });
  }

  async deleteUserMovie(actionId: number) {
    return await prisma.userMovie.delete({
      where: {
        id: actionId,
      },
    });
  }

  async createUserMovie(body: UpdateUserMoviesDto, userId: number) {
    return await prisma.userMovie.create({
      data: { ...body, user_id: userId },
    });
  }

  async updateUserMovie(actionId: number, body: UpdateUserMoviesDto) {
    return await prisma.userMovie.update({
      where: {
        id: actionId,
      },
      data: body,
    });
  }

  async deleteUserLikedMovies(
    body: UpdateUserMoviesDto,
    userId: number,
    type: 'LIKE' | 'DISLIKE',
  ) {
    return await prisma.userMovie.deleteMany({
      where: {
        ...(body.entity_type === CommentEntityType.EPISODE
          ? { episode_id: body.episode_id }
          : { movie_id: body.movie_id }),
        user_id: userId,
        type,
      },
    });
  }

  // get user behavior for movie or episode
  async getUserMovieActions(
    userId: number,
    entityType: CommentEntityType,
    entityId: number,
  ) {
    return await prisma.userMovie.findMany({
      where: {
        ...(entityType === CommentEntityType.EPISODE
          ? { episode_id: entityId }
          : { movie_id: entityId }),
        user_id: userId,
      },
    });
  }

  async getAllUserMovies(
    userId: number,
    type: UserMovieType[],
    page: number,
    pageSize: number,
    lang: AppLanguage,
  ) {
    return await prisma.userMovie.findMany({
      where: {
        type: { in: type },
        user_id: userId,
      },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        type: true,
        progress_time: true,
        entity_type: true,
        movie: {
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
        },
        episode: {
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
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
      skip: page,
      take: pageSize,
    });
  }

  async getMovieUserActivities(
    entityIds: number[],
    entityType: CommentEntityType,
  ) {
    if (entityType === CommentEntityType.MOVIE) {
      return await prisma.userMovie.groupBy({
        by: ['movie_id', 'type'],
        where: {
          movie_id: { in: entityIds },
        },
        _count: {
          _all: true,
        },
      });
    } else {
      return await prisma.userMovie.groupBy({
        by: ['episode_id', 'type'],
        where: {
          episode_id: { in: entityIds },
        },
        _count: {
          _all: true,
        },
      });
    }
  }

  async getUserMoviesCount(userId: number, type: UserMovieType[]) {
    return await prisma.userMovie.count({
      where: {
        type: { in: type },
        user_id: userId,
      },
    });
  }
}
