import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../common/types/types';
import { CreateEpisodeFilePropsType } from '../type/episode-file.type';

@Injectable()
export class EpisodeFileRepository {
  async createEpisodeFiles(
    body: CreateEpisodeFilePropsType[],
    tx: TransactionType,
  ) {
    return await tx.episodeFile.createMany({ data: body });
  }

  async deleteEpisodeFiles(episode_id: number, tx: TransactionType) {
    return await tx.episodeFile.deleteMany({ where: { episode_id } });
  }
}
