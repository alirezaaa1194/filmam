import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../common/types/types';
import { CreateSeasonFilePropsType } from '../type/season-file.type';

@Injectable()
export class SeasonFileRepository {
  async createSeasonFiles(
    body: CreateSeasonFilePropsType[],
    tx: TransactionType,
  ) {
    return await tx.seasonFile.createMany({ data: body });
  }

  async deleteSeasonFiles(season_id: number, tx: TransactionType) {
    return await tx.seasonFile.deleteMany({ where: { season_id } });
  }
}
