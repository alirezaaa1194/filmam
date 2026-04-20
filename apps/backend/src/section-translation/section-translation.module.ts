import { Module } from '@nestjs/common';
import { SectionTranslationService } from './section-translation.service';
import { SectionTranslationRepository } from './repository/section-translation.repository';

@Module({
  providers: [SectionTranslationService, SectionTranslationRepository],
  exports: [SectionTranslationService, SectionTranslationRepository],
})
export class SectionTranslationModule {}
