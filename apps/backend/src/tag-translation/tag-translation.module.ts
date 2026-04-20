import { Module } from '@nestjs/common';
import { TagTranslationService } from './tag-translation.service';
import { TagTranslationRepository } from './repository/tag-translation.repository';

@Module({
  providers: [TagTranslationService, TagTranslationRepository],
  exports: [TagTranslationService, TagTranslationRepository],
})
export class TagTranslationModule {}
