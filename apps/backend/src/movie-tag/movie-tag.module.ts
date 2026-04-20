import { Module } from '@nestjs/common';
import { MovieTagService } from './movie-tag.service';
import { MovieTagRepository } from './repository/movie-tag.repository';

@Module({
  providers: [MovieTagService, MovieTagRepository],
  exports: [MovieTagService, MovieTagRepository],
})
export class MovieTagModule {}
