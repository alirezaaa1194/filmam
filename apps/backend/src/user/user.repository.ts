import { Injectable } from '@nestjs/common';
import { GoogleAuthDto, SignUpDto } from 'src/auth/dto/signup.dto';
import { UserRole } from '@prisma/client';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class UserRepository {
  async createUser(userInfo: SignUpDto | GoogleAuthDto, usersCount: number) {
    return await prisma.user.create({
      data: { ...userInfo, role: usersCount ? UserRole.USER : UserRole.ADMIN },
    });
  }
  async getUserByEmail(userEmail: string) {
    return await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
  }
  async getUserById(userId: number) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
  async changeUserPassword(userEmail: string, newPassword: string) {
    return await prisma.user.update({
      data: {
        password: newPassword,
      },
      where: { email: userEmail },
    });
  }
  async getUsersCount() {
    return await prisma.user.count();
  }
  async blockUser(userId: number, expireTime: Date) {
    return await prisma.user.update({
      data: { block_expires_at: expireTime },
      where: { id: userId },
    });
  }
}
