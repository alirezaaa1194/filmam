import { Module } from '@nestjs/common';
import { MovieFactorRepository } from './repository/movie-factor.repository';
import { MovieFactorService } from './movie-factor.service';
import { UserMovieModule } from '../user-movie/user-movie.module';

@Module({
  imports:[UserMovieModule],
  providers: [MovieFactorService, MovieFactorRepository],
  exports: [MovieFactorService, MovieFactorRepository],
})
export class MovieFactorModule {}
