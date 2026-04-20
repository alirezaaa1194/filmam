import { Module } from '@nestjs/common';
import { MovieGenreService } from './movie-genre.service';
import { MovieGenreRepository } from './repository/movie-genre.repository';


@Module({
  providers: [MovieGenreService, MovieGenreRepository],
  exports: [MovieGenreService, MovieGenreRepository],
})
export class MovieGenreModule {}
