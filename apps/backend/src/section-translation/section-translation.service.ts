import { Injectable } from '@nestjs/common';
import { SectionTranslationRepository } from './repository/section-translation.repository';
import { CreateSectionTranslationDto } from './dto/section-translation.dto';
import { TransactionType } from '../common/types/types';

@Injectable()
export class SectionTranslationService {
  constructor(
    private sectionTranslationRepository: SectionTranslationRepository,
  ) {}

  async createSectionTranslation(
    body: CreateSectionTranslationDto[],
    sectionId: number,
    tx: TransactionType,
  ) {
    const sectionTranslationsData = body.map((sectionTranslation) => {
      return {
        language: sectionTranslation.lang,
        title: sectionTranslation.title,
        description: sectionTranslation.description,
        section_id: sectionId,
      };
    });
    return await this.sectionTranslationRepository.createSectionTranslationAdmin(
      sectionTranslationsData,
      tx
    );
  }

  async deleteSectionTranslations(sectionId: number, tx: TransactionType) {
    return await tx.sectionTranslation.deleteMany({
      where: { section_id: sectionId },
    });
  }
}
