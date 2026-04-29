import { Injectable } from '@nestjs/common';
import { TransactionType } from '../common/types/types';
import { SeasonFileRepository } from './repository/season-file.repository';
import { CreateSeasonFilePropsType } from './type/season-file.type';

@Injectable()
export class SeasonFileService {
  constructor(private seasonFileRepository: SeasonFileRepository) {}
  async createSeasonFiles(
    body: CreateSeasonFilePropsType[],
    tx: TransactionType,
  ) {
    return await this.seasonFileRepository.createSeasonFiles(body, tx);
  }

  async updateSeasonFiles(
    body: CreateSeasonFilePropsType[],
    season_id: number,
    tx: TransactionType,
  ) {
    await this.seasonFileRepository.deleteSeasonFiles(season_id, tx);
    return await this.seasonFileRepository.createSeasonFiles(body, tx);
  }
}
