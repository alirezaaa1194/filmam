import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { UserType } from './auth.type';
import { createHash, randomUUID, randomInt } from 'crypto';
import { Resend } from 'resend';
import { OtpService } from 'src/otp/otp.service';
import { OtpDto, SignupOtpDto } from './dto/otp.dto';
import { OtpType, UserRole } from 'src/generated/prisma/enums';
import { ResetPasswordDto } from './dto/password.dto';
import { LoginRequestService } from 'src/login-request/login-request.service';
type VerifyOtpInput = {
  email: string;
  otp: number;
} & Partial<Pick<SignupOtpDto, 'username' | 'password'>>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private otpService: OtpService,
    private loginRequestService: LoginRequestService,
  ) {}

  async jwtGenerator(userId: number, email: string) {
    const payload = { sub: userId, email: email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(
      { ...payload, jti: randomUUID() },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      },
    );
    const hashedRefreshToken = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.refreshTokenService.deleteUserExpiredTokens(userId);
    await this.refreshTokenService.createRefreshToken(
      hashedRefreshToken,
      userId,
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
  async sendOtpEmail({
    userId,
    userEmail,
    otpType,
  }: {
    userId?: number;
    userEmail?: string;
    otpType: OtpType;
  }) {
    let user: UserType | null = null;
    if (userId) {
      user = await this.userService.getUserById(userId);
    } else if (userEmail) {
      user = await this.userService.getUserByEmail(userEmail);
    }
    const recentOtp = await this.otpService.getUserRecentOtp({
      userId: user?.id,
      otpType: otpType,
    });
    if (!recentOtp) {
      const resend = new Resend(process.env.RESEND_API_Key);
      const otp = randomInt(10000, 99999);
      await this.otpService.deleteUserValidOTPs({
        userId: user?.id,
        otpType: otpType,
      });
      await this.otpService.createOtp({
        otp,
        userId: user?.id,
      });
      if (user) {
        await this.loginRequestService.createLoginRequest(user.id);
      }
      // const { error } = await resend.emails.send({
      //   from: 'Filmam <noreply@filmamapp.ir>',
      //   to: user?.email || userEmail || '',
      //   subject: 'Hello World',
      //   html: `<strong>${otp}</strong>`,
      // });

      const { error } = await resend.emails.send({
        from: 'Filmam <noreply@filmamapp.ir>',
        to: user?.email || userEmail || '',
        subject:
          otpType === OtpType.Login
            ? 'کد ورود به فیلمام'
            : 'کد فعال‌سازی فیلمام',
        headers: {
          'Reply-To': 'filmamapp@gmail.com',
          'X-Google-Original-From': 'filmamapp@gmail.com',
        },
        html: `
    <div style="max-width: 500px; margin: 0 auto; padding: 30px; font-family: Tahoma, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00925d; margin: 0;">فیلمام</h1>
        <p style="color: #999;">فیلم و سریال</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          ${otpType === OtpType.Login ? 'کد ورود شما:' : 'کد فعال‌سازی شما:'}
        </p>
        <div style="background: #00925d; padding: 20px; border-radius: 8px; display: inline-block;">
          <span style="font-size: 40px; font-weight: bold; color: white; letter-spacing: 5px; direction: ltr;">${otp}</span>
        </div>
        <p style="color: #999; margin-top: 20px; font-size: 12px;">این کد تا 5 دقیقه معتبر است</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 11px; text-align: center;">
        اگر این ایمیل را درخواست نکرده‌اید، آن را نادیده بگیرید.<br>
        © 2026 فیلمام
      </p>
    </div>
  `,
      });

      if (error) {
        return console.error({ error });
      }

      return { message: 'otp sent successfully' };
    } else {
      const remainingSeconds = Math.ceil(
        (recentOtp.created_at.getTime() + 2 * 60 * 1000 - Date.now()) / 1000,
      );
      throw new BadRequestException(
        `Previous OTP is still valid. Try again in ${remainingSeconds} seconds.`,
      );
    }
  }

  async verifyOtp(otpDto: OtpDto | SignupOtpDto) {
    const { email, otp } = otpDto;
    let user = await this.userService.getUserByEmail(email);

    const otpInfo = await this.otpService.getUserValidOtp({
      ...(user ? { userId: user.id } : { userEmail: email }),
    });
    if (!otpInfo) {
      throw new UnauthorizedException('OTP not found or expired');
    }

    const otpType = otpInfo.type;

    await this.otpService.incrementOtpAttempts(otpInfo.id);
    if (otpInfo.otp_attempts + 1 >= 5) {
      await this.otpService.expireUserCurrentOtp(otpInfo.id);
      throw new UnauthorizedException('OTP not found or expired');
    }

    const comparedOtp = await bcrypt.compare(
      otp.toString(),
      otpInfo.hashed_otp,
    );

    if (comparedOtp) {
      await this.otpService.expireUserCurrentOtp(otpInfo.id);
      if (!user && otpType === OtpType.Signup) {
        if (!('username' in otpDto) || !('password' in otpDto)) {
          throw new BadRequestException('Invalid signup data');
        }
        const hashedPassword = await bcrypt.hash(otpDto.password, 10);
        user = await this.userService.createUser({
          username: otpDto.username,
          email,
          password: hashedPassword,
        });
      } else if (!user && otpType === OtpType.Login) {
        throw new NotFoundException('User not found');
      }
      if (user) {
        return await this.jwtGenerator(user.id, user.email);
      }
    } else {
      throw new UnauthorizedException('OTP is not correct');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      if (
        user.role !== UserRole.ADMIN &&
        user.block_expires_at &&
        new Date(user.block_expires_at) > new Date()
      ) {
        const userBlockedTime =
          (new Date(user.block_expires_at).getTime() - Date.now()) / 1000;
        throw new BadRequestException(
          `Too many login attempts, try again after ${userBlockedTime} seconds`,
        );
      } else {
        const getUserRecentLoggedInRequestsCounts =
          await this.loginRequestService.getUserRecentLoggedInRequestsCounts(
            user.id,
          );

        if (
          user.role !== UserRole.ADMIN &&
          getUserRecentLoggedInRequestsCounts >= 5
        ) {
          const oneHourNextTime = new Date(Date.now() + 60 * 60 * 1000);
          await this.userService.blockUser(user.id, oneHourNextTime);
          const userBlockedTime =
            (new Date(Date.now() + 60 * 60 * 1000).getTime() - Date.now()) /
            1000;
          throw new BadRequestException(
            `Too many login attempts, try again after ${userBlockedTime} seconds`,
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
              otpType: OtpType.Login,
            });
          } else {
            throw new UnauthorizedException('Invalid email or password');
          }
        } else {
          throw new UnauthorizedException('Invalid email or password');
        }
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async signup(signupDto: SignUpDto) {
    const { email } = signupDto;
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('User with this email already exists');
    } else {
      return await this.sendOtpEmail({
        userEmail: email,
        otpType: OtpType.Signup,
      });
    }
  }

  async me(userInfo: { userId: number; email: string }) {
    const user = await this.userService.getUserById(userInfo.userId);
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
    const user = await this.userService.getUserByEmail(email);
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
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await this.userService.changeUserPassword(email, hashedNewPassword);
            return {
              message: 'Password changed successfully',
            };
          }
        } else {
          throw new UnauthorizedException('Invalid current password');
        }
      } else {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.changeUserPassword(email, hashedNewPassword);
        return {
          message: 'Password changed successfully',
        };
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async forgetPassword(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      if (
        user.role !== UserRole.ADMIN &&
        user.block_expires_at &&
        new Date(user.block_expires_at) > new Date()
      ) {
        const userBlockedTime =
          (new Date(user.block_expires_at).getTime() - Date.now()) / 1000;
        throw new BadRequestException(
          `Too many login attempts, try again after ${userBlockedTime} seconds`,
        );
      } else {
        const getUserRecentLoggedInRequestsCounts =
          await this.loginRequestService.getUserRecentLoggedInRequestsCounts(
            user.id,
          );

        if (
          user.role !== UserRole.ADMIN &&
          getUserRecentLoggedInRequestsCounts >= 5
        ) {
          const oneHourNextTime = new Date(Date.now() + 60 * 60 * 1000);
          await this.userService.blockUser(user.id, oneHourNextTime);
          const userBlockedTime =
            (new Date(Date.now() + 60 * 60 * 1000).getTime() - Date.now()) /
            1000;
          throw new BadRequestException(
            `Too many login attempts, try again after ${userBlockedTime} seconds`,
          );
        } else {
          await this.loginRequestService.createLoginRequest(user.id);
          return await this.sendOtpEmail({
            userEmail: email,
            otpType: OtpType.Forget_Password,
          });
        }
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, otp } = resetPasswordDto;
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      const otpInfo = await this.otpService.getUserValidOtp({
        userEmail: email,
      });
      if (!otpInfo) {
        throw new UnauthorizedException('OTP not found or expired');
      }
      await this.otpService.incrementOtpAttempts(otpInfo.id);

      if (otpInfo.otp_attempts + 1 >= 5) {
        await this.otpService.expireUserCurrentOtp(otpInfo.id);
        throw new UnauthorizedException('OTP not found or expired');
      }

      const comparedOtp = await bcrypt.compare(
        otp.toString(),
        otpInfo.hashed_otp,
      );

      if (comparedOtp) {
        await this.otpService.expireUserCurrentOtp(otpInfo.id);

        try {
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
          await this.userService.changeUserPassword(email, hashedNewPassword);
          return {
            message: 'Password has been reset successfully',
          };
        } catch {
          throw new InternalServerErrorException();
        }
      } else {
        throw new UnauthorizedException('OTP is not correct');
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async refresh(userId: number, userToken: string) {
    const user = await this.userService.getUserById(userId);
    if (user) {
      const userRefreshTokens = await this.refreshTokenService.getValidTokens(
        user.id,
      );
      const hashedUserToken = createHash('sha256')
        .update(userToken)
        .digest('hex');
      const mainToken = userRefreshTokens.find(
        (token) => token.hashed_refresh === hashedUserToken,
      );
      if (mainToken) {
        await this.refreshTokenService.deleteCurrentToken(mainToken.id);
        return await this.jwtGenerator(user.id, user.email);
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async logout(userId: number, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (user) {
      const userRefreshTokens = await this.refreshTokenService.getValidTokens(
        user.id,
      );
      const hashedUserToken = createHash('sha256')
        .update(refreshToken)
        .digest('hex');
      const mainToken = userRefreshTokens.find(
        (token) => token.hashed_refresh === hashedUserToken,
      );
      if (mainToken) {
        await this.refreshTokenService.deleteCurrentToken(mainToken.id);
        return { message: 'logged out successfully' };
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async cleanupOtp(secret: string) {
    if (secret !== process.env.CRON_SECRET) {
      throw new UnauthorizedException('Secret key is not correct');
    }
    await this.otpService.deleteExpiredOTPs();
    await this.loginRequestService.deleteExpiredLoginRequests();
    await this.refreshTokenService.deleteExpiredTokens();
    return { message: 'Expired data deleted' };
  }
}
