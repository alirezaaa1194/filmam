import { Injectable } from '@nestjs/common';
import { SectionMovieRepository } from './repository/section-movie.repository';
import { CreateSectionMovieDto } from './dto/section-movie.dto';
import { TransactionType } from '../common/types/types';

@Injectable()
export class SectionMovieService {
  constructor(private sectionMovieRepository: SectionMovieRepository) {}
  async createSectionMovies(
    body: CreateSectionMovieDto[],
    sectionId: number,
    tx: TransactionType,
  ) {
    const sectionMoviesData = body.map((sectionMovie) => {
      return {
        movie_id: sectionMovie.movie_id,
        order: sectionMovie.order,
        view_mode: sectionMovie.view_mode,
        section_id: sectionId,
      };
    });
    return await this.sectionMovieRepository.createSectionMovies(
      sectionMoviesData,
      tx,
    );
  }

  async deleteSectionMovies(sectionId: number, tx: TransactionType) {
    return await this.sectionMovieRepository.deleteSectionMovies(sectionId, tx);
  }
}
