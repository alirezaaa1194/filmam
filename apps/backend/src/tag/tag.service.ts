import { Injectable, NotFoundException } from '@nestjs/common';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { TagRepository } from './repository/tag.repository';
import { CreateTagDto, GetAllTagsDto } from './dto/tag.dto';
import { TagTranslationService } from '../tag-translation/tag-translation.service';
import { SortType } from '../common/enums';
import { prisma } from '../lib/prisma';

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private tagTranslationService: TagTranslationService,
  ) {}
  async getAllTags(query: GetAllTagsDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );

    const tags = await this.tagRepository.getAllTags({
      page,
      page_size,
      search: query.search?.trim() ?? '',
      lang: query.lang || defaultLang,
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
    });
    const normalizedTags = tags.map((tag) => {
      const tagTranslationInfo = tag.translations[0];
      const { translations, ...otherTagInfo } = tag;
      return { ...otherTagInfo, ...tagTranslationInfo };
    });
    const tagsCount = await this.tagRepository.getTagsCount(
      query.search?.trim(),
    );

    return {
      page: page + 1,
      page_size,
      count: tagsCount,
      data: normalizedTags,
    };
  }

  async getTagDetailAdmin(tagId: number) {
    const tag = await this.tagRepository.getTagDetailAdmin(tagId);
    if (tag) {
      return tag;
    } else {
      throw new NotFoundException('Tag not found');
    }
  }

  async createTag(body: CreateTagDto) {
    const result = await prisma.$transaction(async (tx) => {
      const createdTag = await this.tagRepository.createTag(body.slug, tx);
      return await this.tagTranslationService.createTagTranslation(
        body.translations,
        createdTag.id,
        tx,
      );
    });
    return result;
  }

  async deleteTags(tagIds: number[]) {
    return await this.tagRepository.deleteTags(tagIds);
  }

  async updateTag(tagId: number, body: CreateTagDto) {
    const result = await prisma.$transaction(async (tx) => {
      await this.tagRepository.updateTag(tagId, body, tx);
      return await this.tagTranslationService.updateTagTranslation(
        tagId,
        body.translations,
        tx,
      );
    });
    return result;
  }
}
