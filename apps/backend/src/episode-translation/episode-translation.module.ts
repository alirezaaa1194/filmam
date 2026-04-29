import { Module } from '@nestjs/common';
import { EpisodeTranslationService } from './episode-translation.service';
import { EpisodeTranslationRepository } from './repository/episode-translation.repository';

@Module({
  providers: [EpisodeTranslationService, EpisodeTranslationRepository],
  exports: [EpisodeTranslationService, EpisodeTranslationRepository],
})
export class EpisodeTranslationModule {}
