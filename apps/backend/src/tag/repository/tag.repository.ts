import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateTagDto } from '../dto/tag.dto';
import {
  RepositoryPaginationQueryProps,
  TransactionType,
} from '../../common/types/types';

@Injectable()
export class TagRepository {
  async getTagsCount(search: string = '') {
    return await prisma.tag.count({
      where: {
        translations: {
          some: {
            label: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  async getAllTags(query: RepositoryPaginationQueryProps) {
    return await prisma.tag.findMany({
      include: {
        translations: {
          where: {
            language: query.lang,
          },
          select: { label: true },
        },
      },
      skip: query.page,
      take: query.page_size,
      where: {
        translations: {
          some: {
            label: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      },
      orderBy: {
        created_at: query.sort_type,
      },
    });
  }

  async getTagDetailAdmin(tagIds: number) {
    return await prisma.tag.findUnique({
      where: {
        id: tagIds,
      },
      include: {
        translations: {
          select: {
            id: true,
            created_at: true,
            updated_at: true,
            label: true,
            language: true,
          },
        },
      },
    });
  }

  async createTag(slug: string, tx: TransactionType) {
    return await tx.tag.create({ data: { slug } });
  }

  async deleteTags(tagIds: number[]) {
    return await prisma.tag.deleteMany({
      where: { id: { in: tagIds } },
    });
  }

  async updateTag(tagIds: number, body: CreateTagDto, tx: TransactionType) {
    return await tx.tag.update({
      data: {
        slug: body.slug,
      },
      where: { id: tagIds },
    });
  }
}
