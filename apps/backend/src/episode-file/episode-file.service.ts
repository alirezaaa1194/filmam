import { Injectable } from '@nestjs/common';
import { TransactionType } from '../common/types/types';
import { EpisodeFileRepository } from './repository/episode-file.repository';
import { CreateEpisodeFilePropsType } from './type/episode-file.type';

@Injectable()
export class EpisodeFileService {
  constructor(private episodeFileRepository: EpisodeFileRepository) {}
  async createEpisodeFiles(
    body: CreateEpisodeFilePropsType[],
    tx: TransactionType,
  ) {
    return await this.episodeFileRepository.createEpisodeFiles(body, tx);
  }

  async updateEpisodeFiles(
    body: CreateEpisodeFilePropsType[],
    episode_id: number,
    tx: TransactionType,
  ) {
    await this.episodeFileRepository.deleteEpisodeFiles(episode_id, tx);
    return await this.episodeFileRepository.createEpisodeFiles(body, tx);
  }
}
