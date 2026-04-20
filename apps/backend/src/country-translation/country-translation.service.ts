import { Injectable } from '@nestjs/common';
import { CreateCountryTranslationDto } from './dto/country-translation.dto';
import { CountryTranslationRepository } from './repository/country-translation.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class CountryTranslationService {
  constructor(
    private genreTranslationRepository: CountryTranslationRepository,
  ) {}

  async createCountryTranslation(
    body: CreateCountryTranslationDto[],
    genreId: number,
    tx: TransactionType,
  ) {
    return await this.genreTranslationRepository.createCountryTranslation(
      body,
      genreId,
      tx,
    );
  }

  async updateCountryTranslation(
    genreId: number,
    body: CreateCountryTranslationDto[],
    tx: TransactionType,
  ) {
    return await this.genreTranslationRepository.updateCountryTranslation(
      genreId,
      body,
      tx
    );
  }
}
