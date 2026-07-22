import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieRepository } from './repository/movie.repository';
import { MovieTranslationModule } from '../movie-translation/movie-translation.module';
import { MovieFileModule } from '../movie-file/movie-file.module';
import { MovieFactorModule } from '../movie-factor/movie-factor.module';
import { MovieGenreModule } from '../movie-genre/movie-genre.module';
// import { MovieResolver } from './movie.resolver';
import { MovieCountryModule } from '../movie-country/movie-country.module';
import { MovieLanguageModule } from '../movie-language/movie-language.module';
import { MovieTagModule } from '../movie-tag/movie-tag.module';
import { SectionModule } from '../section/section.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MovieTranslationModule,
    MovieFileModule,
    MovieFactorModule,
    MovieGenreModule,
    MovieCountryModule,
    MovieLanguageModule,
    MovieTagModule,
    SectionModule,
    AuthModule,
  ],
  controllers: [MovieController],
  providers: [MovieService, MovieRepository],
  exports: [MovieService, MovieRepository],
})
export class MovieModule {}
