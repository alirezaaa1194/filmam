import { BadRequestException, Injectable } from '@nestjs/common';
import { SectionMovieRepository } from './repository/section-movie.repository';
import { CreateSectionMovieDto } from './dto/section-movie.dto';
import { TransactionType } from '../common/types/types';
import { CommentEntityType } from '../generated/prisma';

@Injectable()
export class SectionMovieService {
  constructor(private sectionMovieRepository: SectionMovieRepository) {}
  async createSectionMovies(
    body: CreateSectionMovieDto[],
    sectionId: number,
    tx: TransactionType,
  ) {
    const hasSectionMovieWithoutEpisodeData = body.some((sectionMovie) => {
      return (
        sectionMovie.entity_type === CommentEntityType.EPISODE &&
        !sectionMovie.episode_id
      );
    });

    if (hasSectionMovieWithoutEpisodeData) {
      throw new BadRequestException('episode_id is required');
    }

    const sectionMoviesData = body.map((sectionMovie) => {
      return {
        movie_id: sectionMovie.movie_id,
        episode_id: sectionMovie.episode_id,
        order: sectionMovie.order,
        view_mode: sectionMovie.view_mode,
        section_id: sectionId,
        entity_type: sectionMovie.entity_type,
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
