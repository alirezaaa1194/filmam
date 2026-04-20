import { Module } from '@nestjs/common';
import { CountryTranslationService } from './country-translation.service';
import { CountryTranslationRepository } from './repository/country-translation.repository';

@Module({
  providers: [CountryTranslationService, CountryTranslationRepository],
  exports: [CountryTranslationService, CountryTranslationRepository],
})
export class CountryTranslationModule {}
