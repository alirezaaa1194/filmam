import { Module } from '@nestjs/common';
import { UserMovieRepository } from './repository/user-movie.repository';
import { UserMovieService } from './user-movie.service';

@Module({
  providers: [UserMovieService, UserMovieRepository],
  exports: [UserMovieService, UserMovieRepository],
})
export class UserMovieModule {}
