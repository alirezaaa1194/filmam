import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma';

@Injectable()
export class RefreshTokenRepository {
  async deleteUserExpiredTokens(userId: number) {
    return await prisma.refreshToken.deleteMany({
      where: {
        user_id: userId,
        expires_at: {
          lt: new Date(),
        },
      },
    });
  }
  async deleteCurrentToken(tokenId: number) {
    return await prisma.refreshToken.delete({
      where: {
        id: tokenId,
      },
    });
  }
  async createRefreshToken(
    hashed_refresh: string,
    user_id: number,
    expires_at: Date,
  ) {
    return await prisma.refreshToken.create({
      data: { hashed_refresh, user_id, expires_at },
    });
  }
  async getValidTokens(userId: number) {
    return await prisma.refreshToken.findMany({
      where: {
        user_id: userId,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }
  async deleteExpiredTokens() {
    return await prisma.refreshToken.deleteMany({
      where: {
        expires_at: {
          lte: new Date(),
        },
      },
    });
  }
}
