import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma';

@Injectable()
export class LoginRequestRepository {
  async createLoginRequest(userId: number) {
    return await prisma.loginRequest.create({ data: { user_id: userId } });
  }
  async getUserRecentLoggedInRequestsCounts(
    userId: number,
    oneHourAgoTime: Date,
  ) {
    return await prisma.loginRequest.count({
      where: {
        user_id: userId,
        created_at: {
          gt: oneHourAgoTime,
        },
      },
    });
  }

  async deleteExpiredLoginRequests(oneHourAgoTime: Date) {
    await prisma.loginRequest.deleteMany({
      where: {
        created_at: {
          lte: oneHourAgoTime,
        },
      },
    });
  }
}
