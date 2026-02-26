import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UserModule } from '../user/user.module';
import { UploadRepository } from './upload.repository';

@Module({
  imports: [UserModule],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
  exports: [UploadRepository],
})
export class UploadModule {}
