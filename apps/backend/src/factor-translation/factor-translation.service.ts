import { Injectable } from '@nestjs/common';
import { FactorTranslationRepository } from './repository/factor-translation.repository';
import { CreateFactorTranslationDto } from './dto/factor-translation.dto';
import { TransactionType } from '../common/types/types';

@Injectable()
export class FactorTranslationService {
  constructor(
    private factorTranslationRepository: FactorTranslationRepository,
  ) {}
  async createFactorTranslation(
    factorId: number,
    body: CreateFactorTranslationDto[],
    tx: TransactionType,
  ) {
    return await this.factorTranslationRepository.createFactorTranslation(
      factorId,
      body,
      tx,
    );
  }
  async updateFactorTranslation(
    factorId: number,
    body: CreateFactorTranslationDto[],
    tx: TransactionType,
  ) {
    return await this.factorTranslationRepository.updateFactorTranslation(
      factorId,
      body,
      tx,
    );
  }
}
