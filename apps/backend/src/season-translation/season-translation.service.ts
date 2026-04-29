import { Injectable } from '@nestjs/common';
import { SeasonTranslationRepository } from './repository/season-translation.repository';
import { TransactionType } from '../common/types/types';
import { CreateSeasonTranslationPropsType } from './type/season-translation.type';

@Injectable()
export class SeasonTranslationService {
  constructor(
    private seasonTranslationRepository: SeasonTranslationRepository,
  ) {}
  async createSeasonTranslations(
    body: CreateSeasonTranslationPropsType[],
    tx: TransactionType,
  ) {
    return await this.seasonTranslationRepository.createSeasonTranslations(
      body,
      tx,
    );
  }
  async deleteSeasonTranslations(season_id: number, tx: TransactionType) {
    return await this.seasonTranslationRepository.deleteSeasonTranslations(
      season_id,
      tx,
    );
  }
  async updateSeasonTranslations(
    body: CreateSeasonTranslationPropsType[],
    season_id: number,
    tx: TransactionType,
  ) {
    await this.deleteSeasonTranslations(season_id, tx);
    return await this.seasonTranslationRepository.createSeasonTranslations(
      body,
      tx,
    );
  }
}
