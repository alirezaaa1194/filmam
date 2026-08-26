import { Injectable } from '@nestjs/common';
import { LoginRequestRepository } from './repository/login-request.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class LoginRequestService {
  constructor(private loginRequestRepository: LoginRequestRepository) {}
  async createLoginRequest(userId: number, tx?: TransactionType) {
    return await this.loginRequestRepository.createLoginRequest(userId, tx);
  }
  async getUserRecentLoggedInRequestsCounts(
    userId: number,
    tx?: TransactionType,
  ) {
    const oneHourAgoTime = new Date(Date.now() - 60 * 60 * 1000);
    return await this.loginRequestRepository.getUserRecentLoggedInRequestsCounts(
      userId,
      oneHourAgoTime,
      tx,
    );
  }
  async deleteExpiredLoginRequests(tx?: TransactionType) {
    const oneHourAgoTime = new Date(Date.now() - 60 * 60 * 1000);
    return await this.loginRequestRepository.deleteExpiredLoginRequests(
      oneHourAgoTime,
      tx,
    );
  }
}
