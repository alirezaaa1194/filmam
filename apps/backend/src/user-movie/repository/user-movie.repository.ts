import { AppLanguage, CommentEntityType, UserMovieType } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { UpdateUserMoviesDto } from '../dto/user-movie.dto';
import { GetUserMovieByTypeBodyType } from '../type/user-movie.type';
import { TransactionType } from '../../common/types/types';

export class UserMovieRepository {
  async getUserMovieByType(body: GetUserMovieByTypeBodyType, userId: number) {
    return await prisma.userMovie.findMany({
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

  async createUserMovie(
    body: UpdateUserMoviesDto,
    userId: number,
    tx: TransactionType,
  ) {
    return await tx.userMovie.create({
      data: { ...body, user_id: userId },
    });
  }

  async updateUserMovie(
    actionId: number,
    body: UpdateUserMoviesDto,
    tx: TransactionType,
  ) {
    return await tx.userMovie.update({
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
    tx: TransactionType,
  ) {
    return await tx.userMovie.deleteMany({
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
          : {
              movie_id: entityId,
              entity_type: { not: CommentEntityType.EPISODE },
            }),
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
    tx?: TransactionType,
  ) {
    return await (tx ? tx : prisma).userMovie.findMany({
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
            _count: {
              select: {
                seasons: true,
                episodes: true,
              },
            },
            seasons: {
              include: {
                translations: {
                  where: {
                    language: lang,
                  },
                },
              },
            },
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
                intro_start_time: true,
                intro_duration: true,
                outro_duration: true,
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

  async getUserMoviesCount(
    userId: number,
    type: UserMovieType[],
    tx?: TransactionType,
  ) {
    return await (tx ? tx : prisma).userMovie.count({
      where: {
        type: { in: type },
        user_id: userId,
      },
    });
  }
}
