import { Injectable } from '@nestjs/common';
import { FactorFileRepository } from './repository/factor-file.repository';
import { CreateFactorFileDto } from './dto/factor-file.dto';
import { TransactionType } from '../common/types/types';

@Injectable()
export class FactorFileService {
  constructor(private factorFileRepository: FactorFileRepository) {}
  async createFactorFile(body: CreateFactorFileDto, tx: TransactionType) {
    return await this.factorFileRepository.createFactorFile(body, tx);
  }

  async getFactorsFiles(factorIds: number[]) {
    return await this.factorFileRepository.getFactorsFiles(factorIds);
  }

  async updateFactorFile(
    factorId: number,
    uploadId: number,
    tx: TransactionType,
  ) {
    return await this.factorFileRepository.updateFactorFile(factorId, uploadId, tx);
  }
}
