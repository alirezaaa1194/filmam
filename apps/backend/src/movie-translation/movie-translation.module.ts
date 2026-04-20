import { Module } from '@nestjs/common';
import { MovieTranslationService } from './movie-translation.service';
import { MovieTranslationRepository } from './repository/movie-translation.repository';

@Module({
  providers: [MovieTranslationService, MovieTranslationRepository],
  exports: [MovieTranslationService, MovieTranslationRepository],
})
export class MovieTranslationModule {}
