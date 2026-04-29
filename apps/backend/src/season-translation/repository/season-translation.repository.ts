import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../common/types/types';
import { CreateSeasonTranslationPropsType } from '../type/season-translation.type';

@Injectable()
export class SeasonTranslationRepository {
  async createSeasonTranslations(
    body: CreateSeasonTranslationPropsType[],
    tx: TransactionType,
  ) {
    return await tx.seasonTranslation.createMany({ data: body });
  }

  async deleteSeasonTranslations(season_id: number, tx: TransactionType) {
    return await tx.seasonTranslation.deleteMany({ where: { season_id } });
  }
}
