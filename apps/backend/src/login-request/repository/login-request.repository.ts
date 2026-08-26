import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class LoginRequestRepository {
  async createLoginRequest(userId: number, tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.loginRequest.create({ data: { user_id: userId } });
  }
  async getUserRecentLoggedInRequestsCounts(
    userId: number,
    oneHourAgoTime: Date,
    tx?: TransactionType,
  ) {
    const client = tx ?? prisma;
    return await client.loginRequest.count({
      where: {
        user_id: userId,
        created_at: {
          gt: oneHourAgoTime,
        },
      },
    });
  }

  async deleteExpiredLoginRequests(oneHourAgoTime: Date, tx?: TransactionType) {
    const client = tx ?? prisma;
    await client.loginRequest.deleteMany({
      where: {
        created_at: {
          lte: oneHourAgoTime,
        },
      },
    });
  }
}
