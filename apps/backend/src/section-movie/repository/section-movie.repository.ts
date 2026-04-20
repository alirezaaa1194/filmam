import { Injectable } from '@nestjs/common';
import { CreateSectionMovieBodyType } from '../type/section-movie.type';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class SectionMovieRepository {
  constructor() {}
  async createSectionMovies(
    body: CreateSectionMovieBodyType[],
    tx: TransactionType,
  ) {
    return await tx.sectionMovie.createMany({ data: body });
  }

  async deleteSectionMovies(sectionId: number, tx: TransactionType) {
    return await tx.sectionMovie.deleteMany({
      where: { section_id: sectionId },
    });
  }
}
