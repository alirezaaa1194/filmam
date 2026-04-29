import { Module } from '@nestjs/common';
import { SeasonFileService } from './season-file.service';
import { SeasonFileRepository } from './repository/season-file.repository';

@Module({
  providers: [SeasonFileService, SeasonFileRepository],
  exports: [SeasonFileService, SeasonFileRepository],
})
export class SeasonFileModule {}
