import { Injectable } from '@nestjs/common';
import { EpisodeTranslationRepository } from './repository/episode-translation.repository';
import { TransactionType } from '../common/types/types';
import { CreateEpisodeTranslationPropsType } from './type/episode-translation.type';

@Injectable()
export class EpisodeTranslationService {
  constructor(
    private episodeTranslationRepository: EpisodeTranslationRepository,
  ) {}
  async createEpisodeTranslations(
    body: CreateEpisodeTranslationPropsType[],
    tx: TransactionType,
  ) {
    return await this.episodeTranslationRepository.createEpisodeTranslations(
      body,
      tx,
    );
  }
  async deleteEpisodeTranslations(episode_id: number, tx: TransactionType) {
    return await this.episodeTranslationRepository.deleteEpisodeTranslations(
      episode_id,
      tx,
    );
  }
  async updateEpisodeTranslations(
    body: CreateEpisodeTranslationPropsType[],
    episode_id: number,
    tx: TransactionType,
  ) {
    await this.deleteEpisodeTranslations(episode_id, tx);
    return await this.episodeTranslationRepository.createEpisodeTranslations(
      body,
      tx,
    );
  }
}
