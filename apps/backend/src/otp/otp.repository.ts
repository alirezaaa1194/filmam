import { Injectable } from '@nestjs/common';
import { OtpType } from '@prisma/client';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class OtpRepository {
  async createOtp({
    userId,
    userEmail,
    hashedOtp,
    expiresAt,
  }: {
    userId?: number;
    userEmail?: string;
    hashedOtp: string;
    expiresAt: Date;
  }) {
    return await prisma.otp.create({
      data: {
        user_id: userId,
        user_email: userEmail,
        type: OtpType.Login,
        hashed_otp: hashedOtp,
        expires_at: expiresAt,
      },
    });
  }
  async getUserValidOtp({
    userId,
    userEmail,
  }: {
    userId?: number;
    userEmail?: string;
  }) {
    return await prisma.otp.findFirst({
      where: {
        ...(userId ? { user_id: userId } : { user_email: userEmail }),
        used_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }
  async getUserRecentOtp({
    userId,
    userEmail,
    twoMinutesAgoTime,
    otpType,
  }: {
    userId?: number;
    userEmail?: string;
    twoMinutesAgoTime: Date;
    otpType: OtpType;
  }) {
    return await prisma.otp.findFirst({
      where: {
        ...(userId ? { user_id: userId } : { user_email: userEmail }),
        type: otpType,
        used_at: null,
        created_at: {
          gte: twoMinutesAgoTime,
        },
      },
    });
  }
  async deleteUserValidOTPs({
    userId,
    userEmail,
    otpType,
  }: {
    userId?: number;
    userEmail?: string;
    otpType: OtpType;
  }) {
    await prisma.otp.updateMany({
      data: {
        used_at: new Date(),
      },
      where: {
        ...(userId ? { user_id: userId } : { user_email: userEmail }),
        used_at: null,
        type: otpType,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }
  async incrementOtpAttempts(otpId: number) {
    return await prisma.otp.update({
      data: { otp_attempts: { increment: 1 } },
      where: { id: otpId },
    });
  }
  async expireUserCurrentOtp(otpId: number) {
    return await prisma.otp.update({
      data: {
        used_at: new Date(),
      },
      where: {
        id: otpId,
      },
    });
  }
  async deleteExpiredOTPs() {
    return await prisma.otp.deleteMany({
      where: {
        OR: [
          {
            expires_at: {
              lte: new Date(),
            },
          },
          {
            used_at: {
              not: null,
            },
          },
        ],
      },
    });
  }
}
