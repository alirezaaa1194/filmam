import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieRepository } from './repository/movie.repository';
import { MovieTranslationModule } from '../movie-translation/movie-translation.module';
import { MovieFileModule } from '../movie-file/movie-file.module';
import { UserModule } from '../user/user.module';
import { MovieFactorModule } from '../movie-factor/movie-factor.module';
import { MovieGenreModule } from '../movie-genre/movie-genre.module';
import { MovieResolver } from './movie.resolver';
import { MovieCountryModule } from '../movie-country/movie-country.module';
import { MovieLanguageModule } from '../movie-language/movie-language.module';
import { UserMovieModule } from '../user-movie/user-movie.module';
import { MovieTagModule } from '../movie-tag/movie-tag.module';

@Module({
  imports: [
    UserModule,
    MovieTranslationModule,
    MovieFileModule,
    MovieFactorModule,
    MovieGenreModule,
    MovieCountryModule,
    MovieLanguageModule,
    UserMovieModule,
    MovieTagModule,
  ],
  controllers: [MovieController],
  providers: [MovieService, MovieRepository, MovieResolver],
  exports: [MovieService, MovieRepository],
})
export class MovieModule {}
