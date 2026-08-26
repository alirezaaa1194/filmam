import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpRepository } from './repository/otp.repository';
import { OtpType } from '../generated/prisma';
import { TransactionType } from '../common/types/types';

@Injectable()
export class OtpService {
  constructor(private otpRepository: OtpRepository) {}
  async createOtp(
    {
      otp,
      otpType,
      userId,
      userEmail,
    }: {
      otp: number;
      userId?: number;
      otpType: OtpType;
      userEmail?: string;
    },
    tx?: TransactionType,
  ) {
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return await this.otpRepository.createOtp(
      {
        userId,
        otpType,
        userEmail,
        hashedOtp,
        expiresAt,
      },
      tx,
    );
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
    return await this.otpRepository.getUserValidOtp({ userId, userEmail }, tx);
  }
  async getUserRecentOtp(
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
    const twoMinutesAgoTime = new Date(Date.now() - 2 * 60 * 1000);
    return await this.otpRepository.getUserRecentOtp(
      {
        userId,
        userEmail,
        twoMinutesAgoTime,
        otpType,
      },
      tx,
    );
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
    return await this.otpRepository.deleteUserValidOTPs(
      { userId, userEmail, otpType },
      tx,
    );
  }
  async incrementOtpAttempts(otpId: number, tx?: TransactionType) {
    return await this.otpRepository.incrementOtpAttempts(otpId, tx);
  }
  async expireUserCurrentOtp(otpId: number, tx?: TransactionType) {
    return await this.otpRepository.expireUserCurrentOtp(otpId, tx);
  }
  async deleteExpiredOTPs(tx?: TransactionType) {
    return await this.otpRepository.deleteExpiredOTPs(tx);
  }
}
