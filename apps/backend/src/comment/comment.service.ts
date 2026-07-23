import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  CommentVoteDto,
  CreateCommentDto,
  DeleteCommentsDto,
  GetAllCommentsDto,
  GetEntityCommentsDto,
  UpdateCommentDto,
  UpdateCommentStatusDto,
} from './dto/comment.dto';
import { CommentRepository } from './repository/comment.repository';
import { prisma } from '../lib/prisma';
import {
  Comment,
  CommentEntityType,
  CommentStatus,
  CommentVoteStatus,
  UserRole,
} from '../generated/prisma';
import { MovieService } from '../movie/movie.service';
import { EpisodeService } from '../episode/episode.service';
import { paginationCalculator } from '../lib/utils';
import { TransactionType } from '../common/types/types';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly movieService: MovieService,
    private readonly episodeService: EpisodeService,
    private readonly userService: UserService,
  ) {}

  async createComment(userId: number, body: CreateCommentDto) {
    const user = await this.userService.getUserById(userId);
    if (
      user &&
      user.role !== UserRole.ADMIN &&
      user.block_expires_at &&
      new Date(user.block_expires_at) > new Date()
    ) {
      throw new ForbiddenException(
        `You cannot save comment. Your block expires at ${user.block_expires_at}`,
      );
    }

    if (body.entity_type === CommentEntityType.MOVIE && !body.movie_id) {
      throw new BadRequestException('movie_id is required');
    } else if (
      body.entity_type === CommentEntityType.EPISODE &&
      !body.episode_id
    ) {
      throw new BadRequestException('episode_id is required');
    }

    const result = await prisma.$transaction(async (tx) => {
      let movieId: number | null = null;
      if (body.entity_type === CommentEntityType.MOVIE && body.movie_id) {
        const commentMovie = await this.movieService.getMovieDetailAdmin(
          body.movie_id,
          tx,
        );
        if (!commentMovie) {
          throw new BadRequestException('Movie not found');
        } else {
          movieId = commentMovie.id;
        }
      } else if (
        body.entity_type === CommentEntityType.EPISODE &&
        body.episode_id
      ) {
        const commentEpisode = await this.episodeService.getEpisodeDetailAdmin(
          body.episode_id,
          tx,
        );
        if (!commentEpisode) {
          throw new BadRequestException('Episode not found');
        } else {
          movieId = commentEpisode.movie_id;
        }
      }
      if (movieId) {
        return await this.commentRepository.createComment(userId, {
          ...body,
          movie_id: movieId,
        });
      } else {
        throw new BadRequestException('Movie not found');
      }
    });
    return result;
  }

  async updateComment(commentId: number, body: UpdateCommentDto) {
    return await this.commentRepository.updateComment(commentId, body);
  }

  async updateCommentStatus(commentId: number, body: UpdateCommentStatusDto) {
    return await this.commentRepository.updateCommentStatus(commentId, body);
  }

  async deleteComments(body: DeleteCommentsDto) {
    return await this.commentRepository.deleteComments(body);
  }

  async getAllComments(query: GetAllCommentsDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );

    const result = await prisma.$transaction(async (tx) => {
      const comments = await this.commentRepository.getAllComments(
        {
          ...query,
          page,
          page_size,
        },
        tx,
      );

      const normalizedComments = comments.map((comment) => {
        const { movie, episode, ...otherCommentData } = comment;
        return {
          ...otherCommentData,
          movie_title: movie.translations[0].title,
          season_title: episode?.season.translations[0].title ?? null,
          episode_title: episode?.translations[0].title ?? null,
        };
      });

      const allCommentsCount = await this.commentRepository.getAllCommentsCount(
        query.search,
        tx,
        query.status,
      );

      return {
        page: page + 1,
        page_size,
        count: allCommentsCount,
        data: normalizedComments,
      };
    });

    return result;
  }

  async getCommentDetailAdmin(commentId: number) {
    return await this.commentRepository.getCommentDetailAdmin(commentId);
  }

  async addCommentDidUserVoteFields(
    comments: Comment[],
    tx: TransactionType,
    userId?: number,
  ) {
    let updatedComments:
      | null
      | (Comment & {
          did_user_liked: boolean | null;
          did_user_disliked: boolean | null;
        })[] = null;

    if (userId) {
      const commentsIds = comments.map((mc) => mc.id);
      const userCommentVote = await this.commentRepository.getUserCommentVotes(
        commentsIds,
        userId,
        tx,
      );

      const voteMap = new Map();

      userCommentVote.forEach((ucv) =>
        voteMap.set(ucv.comment_id, ucv.vote_status),
      );

      updatedComments = comments.map((mc) => {
        const didUserVote = voteMap.get(mc.id);
        return {
          ...mc,
          did_user_liked: didUserVote === CommentVoteStatus.LIKE,
          did_user_disliked: didUserVote === CommentVoteStatus.DISLIKE,
        };
      });
    } else {
      updatedComments = comments.map((mc) => {
        return {
          ...mc,
          did_user_liked: null,
          did_user_disliked: null,
        };
      });
    }

    return updatedComments;
  }

  async getMovieOrEpisodeComments(
    entityType: CommentEntityType,
    entitySlug: string,
    query: GetEntityCommentsDto,
    userId?: number,
  ) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const result = await prisma.$transaction(async (tx) => {
      const episodeComments =
        await this.commentRepository.getMovieOrEpisodeComments(
          entityType,
          entitySlug,
          {
            page,
            page_size,
          },
          tx,
        );

      const updatedComments = await this.addCommentDidUserVoteFields(
        episodeComments,
        tx,
        userId,
      );

      const episodeAllCommentsCount =
        await this.commentRepository.getMovieOrEpisodeAllCommentsCount(
          entityType,
          entitySlug,
          tx,
        );

      return {
        page: page + 1,
        page_size,
        count: episodeAllCommentsCount,
        data: updatedComments,
      };
    });
    return result;
  }

  async commentVote(commentId: number, userId: number, body: CommentVoteDto) {
    const result = await prisma.$transaction(async (tx) => {
      const comment = await this.commentRepository.getCommentDetailAdmin(
        commentId,
        tx,
      );

      if (comment?.status !== CommentStatus.APPROVED) {
        throw new BadRequestException('You cannot vote on this comment');
      }

      const hasUserDidVote = await this.commentRepository.getCommentVote(
        commentId,
        userId,
        tx,
      );

      if (hasUserDidVote) {
        await this.commentRepository.deleteCommentVote(hasUserDidVote.id, tx);

        if (hasUserDidVote.vote_status !== body.vote_status) {
          await this.commentRepository.createCommentVote(
            commentId,
            userId,
            body,
            tx,
          );
        }

        if (hasUserDidVote.vote_status === CommentVoteStatus.LIKE) {
          if (body.vote_status === CommentVoteStatus.LIKE) {
            await this.commentRepository.updateCommentVote(
              commentId,
              {
                likes_count: {
                  decrement: 1,
                },
              },
              tx,
            );
          } else {
            await this.commentRepository.updateCommentVote(
              commentId,
              {
                likes_count: {
                  decrement: 1,
                },
                dislikes_count: {
                  increment: 1,
                },
              },
              tx,
            );
          }
        } else if (hasUserDidVote.vote_status === CommentVoteStatus.DISLIKE) {
          if (body.vote_status === CommentVoteStatus.DISLIKE) {
            await this.commentRepository.updateCommentVote(
              commentId,
              {
                dislikes_count: {
                  decrement: 1,
                },
              },
              tx,
            );
          } else {
            await this.commentRepository.updateCommentVote(
              commentId,
              {
                dislikes_count: {
                  decrement: 1,
                },
                likes_count: {
                  increment: 1,
                },
              },
              tx,
            );
          }
        }
      } else {
        await this.commentRepository.createCommentVote(
          commentId,
          userId,
          body,
          tx,
        );
        await this.commentRepository.updateCommentVote(
          commentId,
          {
            ...(body.vote_status === CommentVoteStatus.LIKE
              ? {
                  likes_count: {
                    increment: 1,
                  },
                }
              : {
                  dislikes_count: {
                    increment: 1,
                  },
                }),
          },
          tx,
        );
      }
    });
    return result;
  }
}
