import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateLanguageTranslationDto } from '../dto/language-translation.dto';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class LanguageTranslationRepository {
  async createLanguageTranslation(
    body: CreateLanguageTranslationDto[],
    languageId: number,
    tx: TransactionType,
  ) {
    const languageTranslationData = body.map((languageTranslation) => ({
      language_id: languageId,
      lang: languageTranslation.lang,
      label: languageTranslation.label,
    }));

    return await tx.languageTranslation.createMany({
      data: languageTranslationData,
    });
  }

  async updateLanguageTranslation(
    languageId: number,
    body: CreateLanguageTranslationDto[],
    tx?: TransactionType,
  ) {
    const languageTranslationData = body.map((languageTranslation) => ({
      language_id: languageId,
      lang: languageTranslation.lang,
      label: languageTranslation.label,
    }));

    await (tx || prisma).languageTranslation.deleteMany({
      where: {
        language_id: languageId,
      },
    });

    return await (tx || prisma).languageTranslation.createMany({
      data: languageTranslationData,
    });
  }
}
