import { Module } from '@nestjs/common';
import { LoginRequestService } from './login-request.service';
import { LoginRequestRepository } from './repository/login-request.repository';

@Module({
  providers: [LoginRequestService, LoginRequestRepository],
  exports: [LoginRequestService, LoginRequestRepository],
})
export class LoginRequestModule {}
