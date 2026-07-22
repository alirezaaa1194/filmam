import { Injectable } from '@nestjs/common';
import { CreateLanguageTranslationDto } from './dto/language-translation.dto';
import { LanguageTranslationRepository } from './repository/language-translation.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class LanguageTranslationService {
  constructor(
    private genreTranslationRepository: LanguageTranslationRepository,
  ) {}

  async createLanguageTranslation(
    body: CreateLanguageTranslationDto[],
    genreId: number,
    tx: TransactionType,
  ) {
    return await this.genreTranslationRepository.createLanguageTranslation(
      body,
      genreId,
      tx,
    );
  }

  async updateLanguageTranslation(
    genreId: number,
    body: CreateLanguageTranslationDto[],
    tx?: TransactionType,
  ) {
    return await this.genreTranslationRepository.updateLanguageTranslation(
      genreId,
      body,
      tx,
    );
  }
}
