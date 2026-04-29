import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../common/types/types';
import { CreateEpisodeTranslationPropsType } from '../type/episode-translation.type';

@Injectable()
export class EpisodeTranslationRepository {
  async createEpisodeTranslations(
    body: CreateEpisodeTranslationPropsType[],
    tx: TransactionType,
  ) {
    return await tx.episodeTranslation.createMany({ data: body });
  }

  async deleteEpisodeTranslations(episode_id: number, tx: TransactionType) {
    return await tx.episodeTranslation.deleteMany({ where: { episode_id } });
  }
}
