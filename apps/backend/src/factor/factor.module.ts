import { Module } from '@nestjs/common';
import { FactorController } from './factor.controller';
import { FactorService } from './factor.service';
import { FactorRepository } from './repository/factor.repository';
import { UserModule } from '../user/user.module';
import { FactorTranslationModule } from '../factor-translation/factor-translation.module';
import { FactorFileModule } from '../factor-file/factor-file.module';
import { UploadModule } from '../upload/upload.module';
import { MovieFactorModule } from '../movie-factor/movie-factor.module';

@Module({
  imports: [UserModule, FactorTranslationModule, FactorFileModule, UploadModule, MovieFactorModule],
  providers: [FactorService, FactorRepository],
  controllers: [FactorController],
  exports: [FactorService, FactorRepository],
})
export class FactorModule {}
