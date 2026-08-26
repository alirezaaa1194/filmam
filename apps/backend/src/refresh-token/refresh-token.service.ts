import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class RefreshTokenService {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}
  async deleteUserExpiredTokens(userId: number, tx?: TransactionType) {
    return await this.refreshTokenRepository.deleteUserExpiredTokens(userId, tx);
  }
  async deleteUserAllTokens(userId: number, tx?: TransactionType) {
    return await this.refreshTokenRepository.deleteUserAllTokens(userId, tx);
  }
  async deleteCurrentToken(tokenId: number, tx?: TransactionType) {
    return await this.refreshTokenRepository.deleteCurrentToken(tokenId, tx);
  }
  async createRefreshToken(
    hashed_refresh: string,
    user_id: number,
    tx?: TransactionType,
  ) {
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30);
    return await this.refreshTokenRepository.createRefreshToken(
      hashed_refresh,
      user_id,
      expires_at,
      tx,
    );
  }
  async getValidTokens(userId: number, tx?: TransactionType) {
    return await this.refreshTokenRepository.getValidTokens(userId, tx);
  }
  async deleteExpiredTokens(tx?: TransactionType) {
    return await this.refreshTokenRepository.deleteExpiredTokens(tx);
  }
}
