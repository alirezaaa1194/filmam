import { Injectable } from '@nestjs/common';
import { GenreTranslationRepository } from './repository/genre-translation.repository';
import { CreateGenreTranslationDto } from './dto/genre-translation.dto';
import { TransactionType } from '../common/types/types';

@Injectable()
export class GenreTranslationService {
  constructor(private genreTranslationRepository: GenreTranslationRepository) {}

  async createGenreTranslation(
    body: CreateGenreTranslationDto[],
    genreId: number,
    tx: TransactionType,
  ) {
    return await this.genreTranslationRepository.createGenreTranslation(
      body,
      genreId,
      tx,
    );
  }

  async updateGenreTranslation(
    genreId: number,
    body: CreateGenreTranslationDto[],
    tx: TransactionType,
  ) {
    return await this.genreTranslationRepository.updateGenreTranslation(
      genreId,
      body,
      tx
    );
  }
}
