import { Module } from '@nestjs/common';
import { MovieLanguageService } from './movie-language.service';
import { MovieLanguageRepository } from './repository/movie-language.repository';

@Module({
  providers: [MovieLanguageService, MovieLanguageRepository],
  exports: [MovieLanguageService, MovieLanguageRepository],
})
export class MovieLanguageModule {}
