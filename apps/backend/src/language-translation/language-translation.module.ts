import { Module } from '@nestjs/common';
import { LanguageTranslationService } from './language-translation.service';
import { LanguageTranslationRepository } from './repository/language-translation.repository';

@Module({
  providers: [LanguageTranslationService, LanguageTranslationRepository],
  exports: [LanguageTranslationService, LanguageTranslationRepository],
})
export class LanguageTranslationModule {}
