import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class RefreshTokenRepository {
  async deleteUserExpiredTokens(userId: number, tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.refreshToken.deleteMany({
      where: {
        user_id: userId,
        expires_at: {
          lt: new Date(),
        },
      },
    });
  }

  async deleteUserAllTokens(userId: number, tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.refreshToken.deleteMany({
      where: { user_id: userId },
    });
  }

  async deleteCurrentToken(tokenId: number, tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.refreshToken.delete({
      where: {
        id: tokenId,
      },
    });
  }
  async createRefreshToken(
    hashed_refresh: string,
    user_id: number,
    expires_at: Date,
    tx?: TransactionType,
  ) {
    const client = tx ?? prisma;
    return await client.refreshToken.create({
      data: { hashed_refresh, user_id, expires_at },
    });
  }
  async getValidTokens(userId: number, tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.refreshToken.findMany({
      where: {
        user_id: userId,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }
  async deleteExpiredTokens(tx?: TransactionType) {
    const client = tx ?? prisma;
    return await client.refreshToken.deleteMany({
      where: {
        expires_at: {
          lte: new Date(),
        },
      },
    });
  }
}
