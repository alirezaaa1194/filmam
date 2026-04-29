import { Module } from '@nestjs/common';
import { SeasonTranslationService } from './season-translation.service';
import { SeasonTranslationRepository } from './repository/season-translation.repository';

@Module({
  providers: [SeasonTranslationService, SeasonTranslationRepository],
  exports: [SeasonTranslationService, SeasonTranslationRepository],
})
export class SeasonTranslationModule {}
