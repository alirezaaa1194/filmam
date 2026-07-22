import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { UserModule } from '../user/user.module';
import { MovieModule } from '../movie/movie.module';
import { UserMovieModule } from '../user-movie/user-movie.module';
import { MovieTranslationModule } from '../movie-translation/movie-translation.module';
import { MovieGenreModule } from '../movie-genre/movie-genre.module';
import { GenreTranslationModule } from '../genre-translation/genre-translation.module';

@Module({
  imports: [
    UserModule,
    MovieModule,
    UserMovieModule,
    MovieTranslationModule,
    MovieGenreModule,
    GenreTranslationModule,
  ],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
