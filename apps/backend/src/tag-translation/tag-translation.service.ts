import { Injectable } from '@nestjs/common';
import { CreateTagTranslationDto } from './dto/tag-translation.dto';
import { TagTranslationRepository } from './repository/tag-translation.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class TagTranslationService {
  constructor(private tagTranslationRepository: TagTranslationRepository) {}

  async createTagTranslation(
    body: CreateTagTranslationDto[],
    tagId: number,
    tx: TransactionType,
  ) {
    return await this.tagTranslationRepository.createTagTranslation(
      body,
      tagId,
      tx,
    );
  }

  async updateTagTranslation(
    tagId: number,
    body: CreateTagTranslationDto[],
    tx: TransactionType,
  ) {
    return await this.tagTranslationRepository.updateTagTranslation(
      tagId,
      body,
      tx,
    );
  }
}
