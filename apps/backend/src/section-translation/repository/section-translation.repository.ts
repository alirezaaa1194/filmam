import { Injectable } from '@nestjs/common';
import { CreateSectionTranslationBodyType } from '../type/section-translation.type';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class SectionTranslationRepository {
  constructor() {}
  async createSectionTranslationAdmin(
    body: CreateSectionTranslationBodyType[],
    tx: TransactionType,
  ) {
    return await tx.sectionTranslation.createMany({
      data: body,
    });
  }
}
