import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpRepository } from './otp.repository';
import { OtpType } from '@prisma/client';

@Injectable()
export class OtpService {
  constructor(private otpRepository: OtpRepository) {}
  async createOtp({
    otp,
    userId,
    userEmail,
  }: {
    otp: number;
    userId?: number;
    userEmail?: string;
  }) {
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return await this.otpRepository.createOtp({
      userId,
      userEmail,
      hashedOtp,
      expiresAt,
    });
  }
  async getUserValidOtp({
    userId,
    userEmail,
  }: {
    userId?: number;
    userEmail?: string;
  }) {
    return await this.otpRepository.getUserValidOtp({ userId, userEmail });
  }
  async getUserRecentOtp({
    userId,
    userEmail,
    otpType,
  }: {
    userId?: number;
    userEmail?: string;
    otpType: OtpType;
  }) {
    const twoMinutesAgoTime = new Date(Date.now() - 2 * 60 * 1000);
    return await this.otpRepository.getUserRecentOtp({
      userId,
      userEmail,
      twoMinutesAgoTime,
      otpType,
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
    return await this.otpRepository.deleteUserValidOTPs({
      userId,
      userEmail,
      otpType,
    });
  }
  async incrementOtpAttempts(otpId: number) {
    return await this.otpRepository.incrementOtpAttempts(otpId);
  }
  async expireUserCurrentOtp(otpId: number) {
    return await this.otpRepository.expireUserCurrentOtp(otpId);
  }
  async deleteExpiredOTPs() {
    return await this.otpRepository.deleteExpiredOTPs();
  }
}
