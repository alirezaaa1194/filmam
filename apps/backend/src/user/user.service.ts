import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/signup.dto';
import { UserRepository } from './user.repository';
import { GoogleAuthDto } from '../auth/dto/google-auth.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async getUserByEmail(userEmail: string) {
    return await this.userRepository.getUserByEmail(userEmail);
  }
  async getUserById(userId: number) {
    return await this.userRepository.getUserById(userId);
  }
  async createUser(userInfo: SignUpDto | GoogleAuthDto) {
    const usersCount = await this.userRepository.getUsersCount();
    return await this.userRepository.createUser(userInfo, usersCount);
  }
  async changeUserPassword(email: string, newPassword: string) {
    return await this.userRepository.changeUserPassword(email, newPassword);
  }
  async blockUser(userId: number, expireTime: Date) {
    return await this.userRepository.blockUser(userId, expireTime);
  }
}
