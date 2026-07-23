import { Injectable } from '@nestjs/common';
import {
  CommentVoteDto,
  DeleteCommentsDto,
  GetAllCommentsDto,
  GetEntityCommentsDto,
  UpdateCommentDto,
  UpdateCommentStatusDto,
} from '../dto/comment.dto';
import { prisma } from '../../lib/prisma';
import { SortType } from '../../common/enums';
import { TransactionType } from '../../common/types/types';
import { CommentEntityType, CommentStatus } from '../../generated/prisma';
import { CreateCommentRepositoryBodyType } from '../type/comment.type';

@Injectable()
export class CommentRepository {
  async createComment(
    userId: number,
    body: CreateCommentRepositoryBodyType,
    tx?: TransactionType,
  ) {
    return await (tx || prisma).comment.create({
      data: { ...body, user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async updateComment(
    commentId: number,
    body: UpdateCommentDto,
    tx?: TransactionType,
  ) {
    return await (tx || prisma).comment.update({
      where: { id: commentId },
      data: { ...body },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async updateCommentStatus(
    commentId: number,
    body: UpdateCommentStatusDto,
    tx?: TransactionType,
  ) {
    return await (tx || prisma).comment.update({
      where: { id: commentId },
      data: { ...body },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteComments(body: DeleteCommentsDto, tx?: TransactionType) {
    return await (tx || prisma).comment.deleteMany({
      where: { id: { in: body.comment_ids } },
    });
  }

  async getAllComments(query: GetAllCommentsDto, tx: TransactionType) {
    return await tx.comment.findMany({
      where: {
        body: {
          contains: query.search || '',
          mode: 'insensitive',
        },
        ...(query?.status?.length
          ? {
              status: { in: query.status },
            }
          : {}),
      },
      include: {
        movie: {
          select: {
            translations: {
              where: { language: query.lang },
            },
          },
        },
        episode: {
          select: {
            translations: {
              where: { language: query.lang },
            },
            season: {
              include: {
                translations: {
                  where: { language: query.lang },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      take: query.page_size,
      skip: query.page,
      orderBy: {
        created_at: query.sort === SortType.ASC ? 'asc' : 'desc',
      },
    });
  }

  async getAllCommentsCount(
    search: string = '',
    tx: TransactionType,
    status?: CommentStatus[],
  ) {
    return await tx.comment.count({
      where: {
        body: {
          contains: search,
          mode: 'insensitive',
        },

        ...(status?.length
          ? {
              status: { in: status },
            }
          : {}),
      },
    });
  }

  async getCommentDetailAdmin(commentId: number, tx?: TransactionType) {
    return await (tx || prisma).comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async getMovieOrEpisodeComments(
    entityType: CommentEntityType,
    entitySlug: string,
    query: GetEntityCommentsDto,
    tx: TransactionType,
  ) {
    return await tx.comment.findMany({
      where: {
        ...(entityType === CommentEntityType.EPISODE
          ? {
              entity_type: CommentEntityType.EPISODE,
              episode: {
                slug: entitySlug,
              },
            }
          : {
              entity_type: CommentEntityType.MOVIE,
              movie: {
                slug: entitySlug,
              },
            }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      skip: query.page,
      take: query.page_size,
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async getMovieOrEpisodeAllCommentsCount(
    entityType: CommentEntityType,
    entitySlug: string,
    tx: TransactionType,
  ) {
    return await tx.comment.count({
      where: {
        ...(entityType === CommentEntityType.MOVIE
          ? {
              entity_type: entityType,
              movie: {
                slug: entitySlug,
              },
            }
          : {
              entity_type: entityType,
              episode: {
                slug: entitySlug,
              },
            }),
      },
    });
  }

  async getCommentVote(commentId: number, userId: number, tx: TransactionType) {
    return await tx.commentVote.findFirst({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
    });
  }

  async deleteCommentVote(voteId: number, tx: TransactionType) {
    return await tx.commentVote.delete({
      where: { id: voteId },
    });
  }

  async updateCommentVote(
    commentId: number,
    data: {
      likes_count?: {
        decrement?: number;
        increment?: number;
      };
      dislikes_count?: {
        decrement?: number;
        increment?: number;
      };
    },
    tx: TransactionType,
  ) {
    return await tx.comment.update({
      where: { id: commentId },
      data: {
        ...data,
      },
    });
  }

  async createCommentVote(
    commentId: number,
    userId: number,
    body: CommentVoteDto,
    tx: TransactionType,
  ) {
    return await tx.commentVote.create({
      data: {
        user_id: userId,
        comment_id: commentId,
        vote_status: body.vote_status,
      },
    });
  }

  async getUserCommentVotes(
    commentsIds: number[],
    userId: number,
    tx: TransactionType,
  ) {
    return await tx.commentVote.findMany({
      where: { comment_id: { in: commentsIds }, user_id: userId },
    });
  }
}
