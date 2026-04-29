import { Module } from '@nestjs/common';
import { EpisodeFileService } from './episode-file.service';
import { EpisodeFileRepository } from './repository/episode-file.repository';

@Module({
  providers: [EpisodeFileService, EpisodeFileRepository],
  exports: [EpisodeFileService, EpisodeFileRepository],
})
export class EpisodeFileModule {}
