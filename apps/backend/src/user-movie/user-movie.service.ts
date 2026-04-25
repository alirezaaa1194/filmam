import { Injectable } from '@nestjs/common';
import { UserMovieRepository } from './repository/user-movie.repository';
import { UpdateUserMoviesDto } from './dto/user-movie.dto';
import { CommentEntityType, UserMovieType } from '@prisma/client';
import { GetAllUserMovieDto } from '../user/dto/user.dto';
import {
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import {
  GetUserMovieByTypeBodyType,
  SubmitUserMovieActionProps,
} from './type/user-movie.type';
import { prisma } from '../lib/prisma';
import { TransactionType } from '../common/types/types';

@Injectable()
export class UserMovieService {
  constructor(private userMovieRepository: UserMovieRepository) {}

  async hasUserDidAction(body: GetUserMovieByTypeBodyType, userId: number) {
    return await this.userMovieRepository.getUserMovieByType(body, userId);
  }

  async deleteUserMovie(actionId: number, tx: TransactionType) {
    return await this.userMovieRepository.deleteUserMovie(actionId, tx);
  }
  
  async submitUserMovieAction(props: SubmitUserMovieActionProps) {
    if (props.hasUserDidAction) {
      if (props.actionMode === 'DELETE') {
        return await this.deleteUserMovie(props.hasUserDidAction.id, props.tx);
      } else {
        return await this.userMovieRepository.updateUserMovie(
          props.hasUserDidAction.id,
          props.body,
          props.tx,
        );
      }
    } else {
      if (props.callback) {
        await props.callback;
      }
      return await this.userMovieRepository.createUserMovie(
        props.body,
        props.userId,
        props.tx,
      );
    }
  }

  async updateUserMovies(body: UpdateUserMoviesDto, userId: number) {
    const userActions = await this.hasUserDidAction(
      {
        ...body,
        type:
          body.type === UserMovieType.WATCHED ||
          body.type === UserMovieType.WATCHING
            ? [UserMovieType.WATCHED, UserMovieType.WATCHING]
            : body.type === UserMovieType.LIKE
              ? [body.type, UserMovieType.DISLIKE]
              : body.type === UserMovieType.DISLIKE
                ? [body.type, UserMovieType.LIKE]
                : [body.type],
      },
      userId,
    );
    const hasUserDidAction = userActions.find((action) => {
      if (body.type === 'WATCHED' || body.type === 'WATCHING') {
        return action.type === 'WATCHED' || action.type === 'WATCHING';
      } else {
        return action.type === body.type;
      }
    });
    const result = await prisma.$transaction(async (tx) => {
      switch (body.type) {
        case UserMovieType.BOOKMARK: {
          return await this.submitUserMovieAction({
            userId,
            body,
            actionMode: 'DELETE',
            hasUserDidAction,
            tx,
          });
        }

        case UserMovieType.LIKE: {
          //update movie or episode or both stats
          const hasUserDidDisLike = userActions.find(
            (action) => action.type === UserMovieType.DISLIKE,
          );
          if (body.entity_type === CommentEntityType.MOVIE) {
            await tx.movie.update({
              where: { id: body.movie_id },
              data: {
                likes_count: {
                  ...(hasUserDidAction
                    ? {
                        decrement: 1,
                      }
                    : {
                        increment: 1,
                      }),
                },
                ...(!hasUserDidAction && hasUserDidDisLike
                  ? {
                      dislikes_count: {
                        decrement: 1,
                      },
                    }
                  : {}),
              },
            });
          } else if (
            body.entity_type === CommentEntityType.EPISODE &&
            body.episode_id
          ) {
            await tx.episode.update({
              where: { id: body.episode_id },
              data: {
                likes_count: {
                  ...(hasUserDidAction
                    ? {
                        decrement: 1,
                      }
                    : {
                        increment: 1,
                      }),
                },
                ...(!hasUserDidAction && hasUserDidDisLike
                  ? {
                      dislikes_count: {
                        decrement: 1,
                      },
                    }
                  : {}),
              },
            });
            await tx.movie.update({
              where: {
                id: body.movie_id,
              },
              data: {
                likes_count: {
                  ...(hasUserDidAction
                    ? {
                        decrement: 1,
                      }
                    : {
                        increment: 1,
                      }),
                },
                ...(!hasUserDidAction && hasUserDidDisLike
                  ? {
                      dislikes_count: {
                        decrement: 1,
                      },
                    }
                  : {}),
              },
            });
          }

          //update user movie
          return await this.submitUserMovieAction({
            userId,
            body,
            actionMode: 'DELETE',
            hasUserDidAction,
            tx,
            callback: this.userMovieRepository.deleteUserLikedMovies(
              body,
              userId,
              UserMovieType.DISLIKE,
              tx,
            ),
          });
        }

        case UserMovieType.DISLIKE: {
          //update movie or episode or both stats
          const hasUserDidLike = userActions.find(
            (action) => action.type === UserMovieType.LIKE,
          );
          if (body.entity_type === CommentEntityType.MOVIE) {
            await tx.movie.update({
              where: { id: body.movie_id },
              data: {
                dislikes_count: {
                  ...(hasUserDidAction
                    ? {
                        decrement: 1,
                      }
                    : {
                        increment: 1,
                      }),
                },
                ...(!hasUserDidAction && hasUserDidLike
                  ? {
                      likes_count: {
                        decrement: 1,
                      },
                    }
                  : {}),
              },
            });
          } else if (
            body.entity_type === CommentEntityType.EPISODE &&
            body.episode_id
          ) {
            await tx.episode.update({
              where: { id: body.episode_id },
              data: {
                dislikes_count: {
                  ...(hasUserDidAction
                    ? {
                        decrement: 1,
                      }
                    : {
                        increment: 1,
                      }),
                },
                ...(!hasUserDidAction && hasUserDidLike
                  ? {
                      likes_count: {
                        decrement: 1,
                      },
                    }
                  : {}),
              },
            });

            await tx.movie.update({
              where: {
                id: body.movie_id,
              },
              data: {
                dislikes_count: {
                  ...(hasUserDidAction
                    ? {
                        decrement: 1,
                      }
                    : {
                        increment: 1,
                      }),
                },
                ...(!hasUserDidAction && hasUserDidLike
                  ? {
                      likes_count: {
                        decrement: 1,
                      },
                    }
                  : {}),
              },
            });
          }

          //update user movie
          return await this.submitUserMovieAction({
            userId,
            body,
            actionMode: 'DELETE',
            tx,
            hasUserDidAction,
            callback: this.userMovieRepository.deleteUserLikedMovies(
              body,
              userId,
              UserMovieType.LIKE,
              tx,
            ),
          });
        }

        case UserMovieType.WATCHED:
        case UserMovieType.WATCHING: {
          //update movie or episode or both stats
          if (
            body.entity_type === CommentEntityType.MOVIE &&
            !hasUserDidAction
          ) {
            await tx.movie.update({
              where: { id: body.movie_id },
              data: {
                watches_count: {
                  increment: 1,
                },
              },
            });
          } else if (
            body.entity_type === CommentEntityType.EPISODE &&
            !hasUserDidAction
          ) {
            await tx.movie.update({
              where: { id: body.movie_id },
              data: {
                watches_count: {
                  increment: 1,
                },
              },
            });

            await tx.episode.update({
              where: { id: body.episode_id },
              data: {
                watches_count: {
                  increment: 1,
                },
              },
            });
          }

          //update user movie
          return await this.submitUserMovieAction({
            userId,
            body,
            actionMode: 'UPDATE',
            tx,
            hasUserDidAction,
            callback: this.userMovieRepository.deleteUserLikedMovies(
              body,
              userId,
              UserMovieType.LIKE,
              tx,
            ),
          });
        }
      }
    });

    return result;
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

    const updatedEpisodes = episodes.map((userMovie) => {
      const { episode, ...otherUserMovieData } = userMovie;

      return {
        ...otherUserMovieData,
        episode,
      };
    });

    /////////////////////////////
    // Movies:
    const movies = allUserMovies.filter(
      (userMovie) => userMovie.entity_type === CommentEntityType.MOVIE,
    );

    const normalizedUserMovies = movies.map((userMovie) => {
      const { movie, ...otherUserMovieData } = userMovie;
      const normalizedMovie = normalizeMovieDetail(movie);

      return {
        ...otherUserMovieData,
        movie: normalizedMovie,
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
}
