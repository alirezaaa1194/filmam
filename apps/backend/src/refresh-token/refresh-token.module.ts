import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenRepository } from './repository/refresh-token.repository';

@Module({
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService, RefreshTokenRepository],
})
export class RefreshTokenModule {}
