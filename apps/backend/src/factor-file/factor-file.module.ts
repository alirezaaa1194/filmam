import { Module } from '@nestjs/common';
import { FactorFileService } from './factor-file.service';
import { FactorFileRepository } from './repository/factor-file.repository';

@Module({
  providers: [FactorFileService, FactorFileRepository],
  exports: [FactorFileService, FactorFileRepository],
})
export class FactorFileModule {}
