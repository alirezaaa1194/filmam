import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtStrategy as RefreshJwtStrategy } from './strategies/refresh-token.strategy';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { OtpModule } from '../otp/otp.module';
import { AuthStrategy } from './strategies/google.strategy';
import { LoginRequestModule } from '../login-request/login-request.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RefreshTokenModule,
    LoginRequestModule,
    OtpModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, RefreshJwtStrategy, JwtStrategy, AuthStrategy],
  controllers: [AuthController],
  exports: [UserModule],
})
export class AuthModule {}
