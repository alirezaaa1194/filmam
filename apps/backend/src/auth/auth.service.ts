import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserType } from './types/auth.type';
import { createHash, randomUUID, randomInt } from 'crypto';
import { OtpService } from '../otp/otp.service';
import { LoginOtpDto, SignupOtpDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/password.dto';
import { LoginRequestService } from '../login-request/login-request.service';
import { defaultLang } from '../lib/utils';
import { CreateUserDto } from '../user/dto/user.dto';
import { OtpType, UserRole, AppLanguage } from '../generated/prisma';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user/repository/user.repository';
import { authCookieOptions } from './cookies.util';
import { prisma } from '../lib/prisma';
import { TransactionType } from '../common/types/types';
import type { Response as ExpressResponse } from 'express';

export type AuthTokens = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private otpService: OtpService,
    private loginRequestService: LoginRequestService,
    private mailService: MailService,
  ) {}

  async jwtGenerator(userId: number, email: string, tx?: TransactionType): Promise<AuthTokens> {
    const payload = { sub: userId, email: email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET ?? 'default-access-secret',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any,
    });
    const refreshToken = this.jwtService.sign(
      { ...payload, jti: randomUUID() },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'default-refresh-secret',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any,
      },
    );
    const hashedRefreshToken = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.refreshTokenService.deleteUserExpiredTokens(userId, tx);
    await this.refreshTokenService.createRefreshToken(
      hashedRefreshToken,
      userId,
      tx,
    );

    const now = Math.floor(Date.now() / 1000);
    const accessExp =
      (this.jwtService.decode(accessToken) as { exp: number }).exp - now;
    const refreshExp =
      (this.jwtService.decode(refreshToken) as { exp: number }).exp - now;

    return {
      accessToken,
      accessTokenExpiresIn: accessExp,
      refreshToken,
      refreshTokenExpiresIn: refreshExp,
    };
  }

  setAuthCookies(res: ExpressResponse, tokens: AuthTokens) {
    res.cookie(
      'accessToken',
      tokens.accessToken,
      authCookieOptions(tokens.accessTokenExpiresIn),
    );
    res.cookie(
      'refreshToken',
      tokens.refreshToken,
      authCookieOptions(tokens.refreshTokenExpiresIn),
    );
  }

  clearAuthCookies(res: ExpressResponse) {
    res.clearCookie('accessToken', authCookieOptions(0));
    res.clearCookie('refreshToken', authCookieOptions(0));
  }

  async sendOtpEmail({
    userId,
    userEmail,
    otpType,
  }: {
    userId?: number;
    userEmail: string;
    otpType: OtpType;
  }, tx?: TransactionType) {
    let user: UserType | null = null;
    if (userId) {
      user = await this.userRepository.getUserById(userId, tx);
    } else if (userEmail) {
      user = await this.userService.getUserByEmail(userEmail, tx);
    }

    if (otpType !== 'SIGNUP' && !user) {
      throw new NotFoundException('User not found');
    }

    const otp = randomInt(10000, 99999);
    await this.otpService.deleteUserValidOTPs({
      userId: user?.id,
      otpType: otpType,
    }, tx);
    await this.otpService.createOtp({
      otp,
      otpType,
      userId: user?.id,
      userEmail: userEmail,
    }, tx);

    if (user) {
      await this.loginRequestService.createLoginRequest(user.id, tx);
    }

    const lang = user?.preferred_language ?? AppLanguage.FA;
    const { subject, html } = this.getEmailContent(otpType, otp, lang);

    const { error } = await this.mailService.sendEmail(
      user?.email || userEmail,
      subject,
      html,
    );

    if (error) {
      throw new InternalServerErrorException('Failed to send email');
    }

    return { message: 'OTP sent successfully' };
  }

  private getEmailContent(
    otpType: OtpType,
    otp: number,
    lang: AppLanguage,
  ): { subject: string; html: string } {
    const content = {
      [AppLanguage.FA]: {
        brand: 'فیلمام',
        tagline: 'فیلم و سریال',
        loginSubject: 'کد ورود به فیلمام',
        signupSubject: 'کد فعال‌سازی فیلمام',
        loginBody: 'کد ورود شما:',
        signupBody: 'کد فعال‌سازی شما:',
        expiry: 'این کد تا ۵ دقیقه معتبر است',
        footer: 'اگر این ایمیل را درخواست نکرده‌اید، آن را نادیده بگیرید.',
        copyright: '© ۲۰۲۶ فیلمام',
      },
      [AppLanguage.EN]: {
        brand: 'Filmam',
        tagline: 'Movies & Series',
        loginSubject: 'Login Code for Filmam',
        signupSubject: 'Verification Code for Filmam',
        loginBody: 'Your login code:',
        signupBody: 'Your verification code:',
        expiry: 'This code is valid for 5 minutes',
        footer: 'If you did not request this email, please ignore it.',
        copyright: '© 2026 Filmam',
      },
      [AppLanguage.AR]: {
        brand: 'فيلمام',
        tagline: 'أفلام ومسلسلات',
        loginSubject: 'رمز تسجيل الدخول إلى فيلمام',
        signupSubject: 'رمز التفعيل فيلمام',
        loginBody: 'رمز تسجيل الدخول الخاص بك:',
        signupBody: 'رمز التفعيل الخاص بك:',
        expiry: 'هذا الرمز صالح لمدة ۵ دقائق',
        footer: 'إذا لم تطلب هذا البريد الإلكتروني، يرجى تجاهله.',
        copyright: '© ۲۰۲٦ فيلمام',
      },
    };

    const c = content[lang] || content[defaultLang];
    const isLogin = otpType === OtpType.LOGIN;

    return {
      subject: isLogin ? c.loginSubject : c.signupSubject,
      html: `
    <div style="max-width: 500px; margin: 0 auto; padding: 30px; font-family: Tahoma, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00925d; margin: 0;">${c.brand}</h1>
        <p style="color: #999;">${c.tagline}</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          ${isLogin ? c.loginBody : c.signupBody}
        </p>
        <div style="background: #00925d; padding: 20px; border-radius: 8px; display: inline-block;">
          <span style="font-size: 40px; font-weight: bold; color: white; letter-spacing: 5px; direction: ltr;">${otp}</span>
        </div>
        <p style="color: #999; margin-top: 20px; font-size: 12px;">${c.expiry}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 11px; text-align: center;">
        ${c.footer}<br>
        ${c.copyright}
      </p>
    </div>
  `,
    };
  }

  async verifyOtp(otpDto: LoginOtpDto | SignupOtpDto, adminOnly?: boolean) {
    return await prisma.$transaction(async (tx) => {
      const { email, otp } = otpDto;
      let user = await this.userService.getUserByEmail(email, tx);

      if (adminOnly && user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('This route is for admin');
      }

      const otpInfo = await this.otpService.getUserValidOtp({
        ...(user ? { userId: user.id } : { userEmail: email }),
      }, tx);
      if (!otpInfo) {
        throw new UnauthorizedException('OTP not found or expired');
      }

      const otpType = otpInfo.type;

      await this.otpService.incrementOtpAttempts(otpInfo.id, tx);
      if (otpInfo.otp_attempts + 1 >= 5) {
        await this.otpService.expireUserCurrentOtp(otpInfo.id, tx);
        throw new UnauthorizedException('OTP not found or expired');
      }

      const comparedOtp = await bcrypt.compare(
        otp.toString(),
        otpInfo.hashed_otp,
      );

      if (comparedOtp) {
        await this.otpService.expireUserCurrentOtp(otpInfo.id, tx);
        if (!user && otpType === OtpType.SIGNUP) {
          if (!('username' in otpDto) || !('password' in otpDto)) {
            throw new BadRequestException('Invalid signup data');
          }
          const hashedPassword = await bcrypt.hash(otpDto.password, 10);
          user = await this.userService.signupUser({
            username: otpDto.username,
            email,
            password: hashedPassword,
            preferred_language: otpDto.preferred_language,
          }, tx);
        } else if (!user && otpType === OtpType.LOGIN) {
          throw new UnauthorizedException('Invalid email or password');
        }
        if (user) {
          return await this.jwtGenerator(user.id, user.email, tx);
        }
        throw new UnauthorizedException('Invalid email or password');
      } else {
        throw new UnauthorizedException('OTP is not correct');
      }
    });
  }

  async login(loginDto: LoginDto, adminOnly?: boolean) {
    return await prisma.$transaction(async (tx) => {
      const { email, password } = loginDto;
      const user = await this.userService.getUserByEmail(email, tx);

      if (adminOnly && user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('This route is for admin');
      }

      if (user) {
        if (
          user.role !== UserRole.ADMIN &&
          user.block_expires_at &&
          new Date(user.block_expires_at) > new Date()
        ) {
          const userBlockedTime =
            (new Date(user.block_expires_at).getTime() - Date.now()) / 1000;
          throw new HttpException(
            `Too many login attempts, try again after ${userBlockedTime} seconds`,
            HttpStatus.TOO_MANY_REQUESTS,
          );
        } else {
          const getUserRecentLoggedInRequestsCounts =
            await this.loginRequestService.getUserRecentLoggedInRequestsCounts(
              user.id,
              tx,
            );

          if (
            user.role !== UserRole.ADMIN &&
            getUserRecentLoggedInRequestsCounts >= 5
          ) {
            const oneHourNextTime = new Date(Date.now() + 60 * 60 * 1000);
            await this.userService.blockUser(user.id, oneHourNextTime, tx);
            const userBlockedTime =
              (new Date(Date.now() + 60 * 60 * 1000).getTime() - Date.now()) /
              1000;
            throw new HttpException(
              `Too many login attempts, try again after ${userBlockedTime} seconds`,
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
          if (user.password) {
            const comparedPassword = await bcrypt.compare(
              password,
              user.password,
            );
            if (comparedPassword) {
              return await this.sendOtpEmail({
                userId: user.id,
                userEmail: user.email,
                otpType: OtpType.LOGIN,
              }, tx);
            } else {
              throw new UnauthorizedException('Invalid email or password');
            }
          } else {
            throw new UnauthorizedException('Invalid email or password');
          }
        }
      } else {
        throw new UnauthorizedException('Invalid email or password');
      }
    });
  }

  async signup(signupDto: CreateUserDto) {
    return await prisma.$transaction(async (tx) => {
      const { email } = signupDto;
      const user = await this.userService.getUserByEmail(email, tx);

      if (user) {
        throw new ConflictException('User with this email already exists');
      } else {
        return await this.sendOtpEmail({
          userEmail: email,
          otpType: OtpType.SIGNUP,
        }, tx);
      }
    });
  }

  async me(userInfo: { userId: number; email: string }) {
    const user = await this.userRepository.getUserById(userInfo.userId);
    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async changePassword(
    email: string,
    currentPassword: string | null,
    newPassword: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const user = await this.userService.getUserByEmail(email, tx);
      if (user) {
        if (user.password && currentPassword) {
          const comparedPassword = await bcrypt.compare(
            currentPassword,
            user.password,
          );
          if (comparedPassword) {
            const compareCurrentAndNewPassword = await bcrypt.compare(
              newPassword,
              user.password,
            );
            if (compareCurrentAndNewPassword) {
              throw new ConflictException(
                'New password is equal to current password',
              );
            } else {
              await this.refreshTokenService.deleteUserAllTokens(user.id, tx);

              const hashedNewPassword = await bcrypt.hash(newPassword, 10);
              await this.userService.changeUserPassword(email, hashedNewPassword, tx);
              return {
                message: 'Password changed successfully',
              };
            }
          } else {
            throw new BadRequestException('Invalid current password');
          }
        } else {
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
          await this.userService.changeUserPassword(email, hashedNewPassword, tx);
          return {
            message: 'Password changed successfully',
          };
        }
      } else {
        throw new NotFoundException('User not found');
      }
    });
  }

  async forgetPassword(email: string, adminOnly?: boolean) {
    return await prisma.$transaction(async (tx) => {
      const user = await this.userService.getUserByEmail(email, tx);

      if (adminOnly && user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('This Route is for admin');
      }

      if (user) {
        if (
          user.role !== UserRole.ADMIN &&
          user.block_expires_at &&
          new Date(user.block_expires_at) > new Date()
        ) {
          const userBlockedTime =
            (new Date(user.block_expires_at).getTime() - Date.now()) / 1000;
          throw new HttpException(
            `Too many login attempts, try again after ${userBlockedTime} seconds`,
            HttpStatus.TOO_MANY_REQUESTS,
          );
        } else {
          const getUserRecentLoggedInRequestsCounts =
            await this.loginRequestService.getUserRecentLoggedInRequestsCounts(
              user.id,
              tx,
            );

          if (
            user.role !== UserRole.ADMIN &&
            getUserRecentLoggedInRequestsCounts >= 5
          ) {
            const oneHourNextTime = new Date(Date.now() + 60 * 60 * 1000);
            await this.userService.blockUser(user.id, oneHourNextTime, tx);
            const userBlockedTime =
              (new Date(Date.now() + 60 * 60 * 1000).getTime() - Date.now()) /
              1000;
            throw new HttpException(
              `Too many login attempts, try again after ${userBlockedTime} seconds`,
              HttpStatus.TOO_MANY_REQUESTS,
            );
          } else {
            await this.loginRequestService.createLoginRequest(user.id, tx);
            return await this.sendOtpEmail({
              userEmail: email,
              otpType: OtpType.FORGET_PASSWORD,
            }, tx);
          }
        }
      } else {
        throw new UnauthorizedException('Invalid email or password');
      }
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, adminOnly?: boolean) {
    return await prisma.$transaction(async (tx) => {
      const { email, new_password, otp } = resetPasswordDto;
      const user = await this.userService.getUserByEmail(email, tx);

      if (adminOnly && user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('This Route is for admin');
      }

      if (user) {
        const otpInfo = await this.otpService.getUserValidOtp({
          userEmail: email,
        }, tx);

        if (!otpInfo) {
          throw new UnauthorizedException('OTP not found or expired');
        }
        await this.otpService.incrementOtpAttempts(otpInfo.id, tx);

        if (otpInfo.otp_attempts + 1 >= 5) {
          await this.otpService.expireUserCurrentOtp(otpInfo.id, tx);
          throw new UnauthorizedException('OTP not found or expired');
        }

        const comparedOtp = await bcrypt.compare(
          otp.toString(),
          otpInfo.hashed_otp,
        );

        if (comparedOtp) {
          await this.otpService.expireUserCurrentOtp(otpInfo.id, tx);

          await this.refreshTokenService.deleteUserAllTokens(user.id, tx);

          const hashedNewPassword = await bcrypt.hash(new_password, 10);
          await this.userService.changeUserPassword(email, hashedNewPassword, tx);
          return {
            message: 'Password has been reset successfully',
          };
        } else {
          throw new UnauthorizedException('OTP is not correct');
        }
      } else {
        throw new UnauthorizedException('Invalid email or password');
      }
    });
  }

  async refresh(userId: number, userToken: string) {
    return await prisma.$transaction(async (tx) => {
      const user = await this.userRepository.getUserById(userId, tx);
      if (user) {
        const userRefreshTokens = await this.refreshTokenService.getValidTokens(
          user.id,
          tx,
        );
        const hashedUserToken = createHash('sha256')
          .update(userToken)
          .digest('hex');
        const mainToken = userRefreshTokens.find(
          (token) => token.hashed_refresh === hashedUserToken,
        );

        if (mainToken) {
          return await this.jwtGenerator(user.id, user.email, tx);
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      } else {
        throw new NotFoundException('User not found');
      }
    });
  }

  async logout(userId: number, refreshToken: string) {
    return await prisma.$transaction(async (tx) => {
      const user = await this.userRepository.getUserById(userId, tx);
      if (user) {
        const userRefreshTokens = await this.refreshTokenService.getValidTokens(
          user.id,
          tx,
        );
        const hashedUserToken = createHash('sha256')
          .update(refreshToken)
          .digest('hex');
        const mainToken = userRefreshTokens.find(
          (token) => token.hashed_refresh === hashedUserToken,
        );
        if (mainToken) {
          await this.refreshTokenService.deleteCurrentToken(mainToken.id, tx);
          return { message: 'Logged out successfully' };
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      } else {
        throw new NotFoundException('User not found');
      }
    });
  }

  async logoutByToken(refreshToken: string | null | undefined) {
    if (!refreshToken) return;
    try {
      const payload = this.jwtService.decode(refreshToken) as {
        sub?: number;
      } | null;
      if (payload?.sub) {
        await this.logout(payload.sub, refreshToken);
      }
    } catch {
      // token may already be invalid/expired — cookies are still cleared by the controller
    }
  }

  async cleanupOtp(secret: string) {
    if (secret !== process.env.CRON_SECRET) {
      throw new UnauthorizedException('Secret key is not correct');
    }
    return await prisma.$transaction(async (tx) => {
      await this.otpService.deleteExpiredOTPs(tx);
      await this.loginRequestService.deleteExpiredLoginRequests(tx);
      await this.refreshTokenService.deleteExpiredTokens(tx);
      return { message: 'Expired data cleaned up' };
    });
  }
}