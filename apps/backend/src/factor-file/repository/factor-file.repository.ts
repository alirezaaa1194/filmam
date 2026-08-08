import { Injectable } from '@nestjs/common';
import { CreateFactorFileDto } from '../dto/factor-file.dto';
import { prisma } from '../../lib/prisma';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class FactorFileRepository {
  async createFactorFile(body: CreateFactorFileDto, tx: TransactionType) {
    return await tx.factorFile.create({
      data: {
        factor_id: body.factor_id,
        upload_id: body.upload_id,
        type: body.upload_type,
      },
    });
  }

  async getFactorsFiles(factorIds: number[]) {
    return await prisma.factorFile.findMany({
      where: { factor_id: { in: factorIds } },
    });
  }

  async updateFactorFile(
    factorId: number,
    uploadId: number,
    tx: TransactionType,
  ) {
    return await tx.factorFile.updateMany({
      where: { factor_id: factorId },
      data: {
        upload_id: uploadId,
      },
    });
  }

  async deleteFactorFiles(factorId: number, tx: TransactionType) {
    return await tx.factorFile.deleteMany({
      where: { factor_id: factorId },
    });
  }
}
