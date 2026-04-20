import { Module } from '@nestjs/common';
import { MovieFileService } from './movie-file.service';
import { MovieFileRepository } from './repository/movie-file.repository';

@Module({
  providers: [MovieFileService, MovieFileRepository],
  exports: [MovieFileService, MovieFileRepository],
})
export class MovieFileModule {}
