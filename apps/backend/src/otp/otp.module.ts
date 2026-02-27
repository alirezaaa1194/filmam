import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRepository } from './repository/otp.repository';

@Module({
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
