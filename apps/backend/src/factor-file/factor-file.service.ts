import { Injectable } from '@nestjs/common';
import { FactorFileRepository } from './repository/factor-file.repository';
import { CreateFactorFileDto } from './dto/factor-file.dto';
import { TransactionType } from '../common/types/types';
import { FactorFileType } from '../generated/prisma';

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
    await this.factorFileRepository.deleteFactorFiles(factorId, tx);
    return await this.factorFileRepository.createFactorFile(
      {
        factor_id: factorId,
        upload_id: uploadId,
        upload_type: FactorFileType.PROFILE,
      },
      tx,
    );
  }
}
