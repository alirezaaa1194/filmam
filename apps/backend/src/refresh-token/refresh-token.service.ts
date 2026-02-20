import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}
  async deleteUserExpiredTokens(userId: number) {
    return await this.refreshTokenRepository.deleteUserExpiredTokens(userId);
  }
  async deleteCurrentToken(tokenId: number) {
    return await this.refreshTokenRepository.deleteCurrentToken(tokenId);
  }
  async createRefreshToken(hashed_refresh: string, user_id: number) {
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30);
    return await this.refreshTokenRepository.createRefreshToken(
      hashed_refresh,
      user_id,
      expires_at,
    );
  }
  async getValidTokens(userId: number) {
    return await this.refreshTokenRepository.getValidTokens(userId);
  }
  async deleteExpiredTokens() {
    return await this.refreshTokenRepository.deleteExpiredTokens();
  }
}
