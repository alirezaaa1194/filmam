import { Injectable } from '@nestjs/common';
import { OtpType } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class OtpRepository {
  async createOtp(
    {
      userId,
      userEmail,
      otpType,
      hashedOtp,
      expiresAt,
    }: {
      userId?: number;
      userEmail?: string;
      otpType: OtpType;
      hashedOtp: string;
      expiresAt: Date;
    },
    tx?: TransactionType,
  ) {
    const client = tx ?? prisma;
    return await client.otp.create({
      data: {
        user_id: userId,
        user_email: userEmail,
        type: otpType,
        hashed_otp: hashedOtp,
        expires_at: expiresAt,
      },
    });
  }
  async getUserValidOtp(
    {
      userId,
      userEmail,
    }: {
      userId?: number;
      userEmail?: string;
    },
    tx?: TransactionType,
  ) {
    const client = tx ?? prisma;
    return await client.otp.findFirst({
      where: {
        ...(userId ? { user_id: userId } : { user_email: userEmail }),
        used_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }
  async getUserRecentOtp(
    {
      userId,
      userEmail,
      twoMinutesAgoTime,
      otpType,
    }: {
      userId?: number;
      userEmail?: string;
      twoMinutesAgoTime: Date;
      otpType: OtpType;
    },
    tx?: TransactionType,
  ) {
    const client = tx ?? prisma;
    return await client.otp.findFirst({
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
  async deleteUserValidOTPs(
    {
      userId,
      userEmail,
      otpType,
    }: {
      userId?: number;
      userEmail?: string;
      otpType: OtpType;
    },
    tx?: TransactionType,
  ) {
    const client = tx ?? prisma;
    await client.otp.updateMany({
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
  async incrementOtpAttempts(otpId: number, tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.otp.update({
      data: { otp_attempts: { increment: 1 } },
      where: { id: otpId },
    });
  }
  async expireUserCurrentOtp(otpId: number, tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.otp.update({
      data: {
        used_at: new Date(),
      },
      where: {
        id: otpId,
      },
    });
  }
  async deleteExpiredOTPs(tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.otp.deleteMany({
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
