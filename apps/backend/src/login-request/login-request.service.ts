import { Injectable } from '@nestjs/common';
import { LoginRequestRepository } from './login-request.repository';

@Injectable()
export class LoginRequestService {
  constructor(private loginRequestRepository: LoginRequestRepository) {}
  async createLoginRequest(userId: number) {
    return await this.loginRequestRepository.createLoginRequest(userId);
  }
  async getUserRecentLoggedInRequestsCounts(userId: number) {
    const oneHourAgoTime = new Date(Date.now() - 60 * 60 * 1000);
    return await this.loginRequestRepository.getUserRecentLoggedInRequestsCounts(
      userId,
      oneHourAgoTime,
    );
  }
  async deleteExpiredLoginRequests() {
    const oneHourAgoTime = new Date(Date.now() - 60 * 60 * 1000);
    return await this.loginRequestRepository.deleteExpiredLoginRequests(
      oneHourAgoTime,
    );
  }
}
