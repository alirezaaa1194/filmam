import { Module } from '@nestjs/common';
import { GenreTranslationRepository } from './repository/genre-translation.repository';
import { GenreTranslationService } from './genre-translation.service';

@Module({
  providers: [GenreTranslationService, GenreTranslationRepository],
  exports: [GenreTranslationService, GenreTranslationRepository],
})
export class GenreTranslationModule {}
