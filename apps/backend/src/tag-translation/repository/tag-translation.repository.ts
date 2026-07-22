import { Injectable } from '@nestjs/common';
import { CreateTagTranslationDto } from '../dto/tag-translation.dto';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class TagTranslationRepository {
  async createTagTranslation(
    body: CreateTagTranslationDto[],
    tagId: number,
    tx: TransactionType,
  ) {
    const tagTranslationData = body.map((tagTranslation) => ({
      tag_id: tagId,
      language: tagTranslation.lang,
      label: tagTranslation.label,
    }));

    return await tx.tagTranslation.createMany({
      data: tagTranslationData,
    });
  }

  async updateTagTranslation(
    tagId: number,
    body: CreateTagTranslationDto[],
    tx: TransactionType,
  ) {
    const tagTranslationData = body.map((tagTranslation) => ({
      tag_id: tagId,
      language: tagTranslation.lang,
      label: tagTranslation.label,
    }));

    await tx.tagTranslation.deleteMany({
      where: {
        tag_id: tagId,
      },
    });

    return await tx.tagTranslation.createMany({
      data: tagTranslationData,
    });
  }
}
