import { Module } from '@nestjs/common';
import { SectionMovieService } from './section-movie.service';
import { SectionMovieRepository } from './repository/section-movie.repository';

@Module({
  providers: [SectionMovieService, SectionMovieRepository],
  exports: [SectionMovieService, SectionMovieRepository],
})
export class SectionMovieModule {}
