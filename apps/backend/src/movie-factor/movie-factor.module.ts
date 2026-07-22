import { Module } from '@nestjs/common';
import { MovieFactorRepository } from './repository/movie-factor.repository';
import { MovieFactorService } from './movie-factor.service';

@Module({
  providers: [MovieFactorService, MovieFactorRepository],
  exports: [MovieFactorService, MovieFactorRepository],
})
export class MovieFactorModule {}
