import { Module } from '@nestjs/common';
import { FactorTranslationService } from './factor-translation.service';
import { FactorTranslationRepository } from './repository/factor-translation.repository';

@Module({
  providers: [FactorTranslationService, FactorTranslationRepository],
  exports: [FactorTranslationService, FactorTranslationRepository],
})
export class FactorTranslationModule {}
