import { Injectable } from '@nestjs/common';
import { CreateFactorTranslationDto } from '../dto/factor-translation.dto';
import { prisma } from '../../lib/prisma';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class FactorTranslationRepository {
  async createFactorTranslation(
    factorId: number,
    body: CreateFactorTranslationDto[],
    tx:TransactionType
  ) {
    const factorTranslationData = body.map((factorTranslation) => ({
      factor_id: factorId,
      first_name: factorTranslation.first_name,
      last_name: factorTranslation.last_name,
      language: factorTranslation.lang,
    }));
    return await tx.factorTranslation.createMany({
      data: factorTranslationData,
    });
  }
  async updateFactorTranslation(
    factorId: number,
    body: CreateFactorTranslationDto[],
    tx:TransactionType
  ) {
    await prisma.factorTranslation.deleteMany({
      where: {
        factor_id: factorId,
      },
    });
    return await this.createFactorTranslation(factorId, body, tx);
  }
}
