import { Module } from '@nestjs/common';
import { MovieCountryService } from './movie-country.service';
import { MovieCountryRepository } from './repository/movie-country.repository';

@Module({
  providers: [MovieCountryService, MovieCountryRepository],
  exports: [MovieCountryService, MovieCountryRepository],
})
export class MovieCountryModule {}
