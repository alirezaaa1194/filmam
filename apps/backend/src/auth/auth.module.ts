import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtStrategy as RefreshJwtStrategy } from './local.strategy';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { OtpModule } from 'src/otp/otp.module';
import { OtpService } from 'src/otp/otp.service';
import { AuthStrategy } from './google.strategy';
import { LoginRequestModule } from 'src/login-request/login-request.module';

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
  providers: [
    AuthService,
    RefreshJwtStrategy,
    // JwtService,
    // RefreshTokenService,
    JwtStrategy,
    AuthStrategy,
    LoginRequestModule,
  ],
  controllers: [AuthController],
  exports: [UserModule],
})
export class AuthModule {}
