import { Injectable } from '@nestjs/common';
import { UserRole } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { GoogleAuthDto } from '../../auth/dto/google-auth.dto';
import { CreateUserDto, UpdateUserInfoDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  async createUser(
    userInfo: CreateUserDto | GoogleAuthDto,
    userRole: UserRole,
  ) {
    return await prisma.user.create({
      data: { ...userInfo, role: userRole },
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

  async blockUser(userId: number, expireTime: Date | null) {
    return await prisma.user.update({
      data: { block_expires_at: expireTime },
      where: { id: userId, role: { not: UserRole.ADMIN } },
    });
  }

  async getAllUsersAdmin(query: {
    page: number;
    page_size: number;
    search: string;
    sort: 'asc' | 'desc';
    blocked: boolean;
  }) {
    return await prisma.user.findMany({
      skip: query.page,
      take: query.page_size,
      where: {
        OR: [
          {
            username: {
              contains: query.search,
            },
          },
          {
            email: {
              contains: query.search,
            },
          },
        ],
        AND: {
          ...(query.blocked ? { block_expires_at: { gt: new Date() } } : {}),
        },
      },
      orderBy: {
        created_at: query.sort,
      },
    });
  }

  async deleteUserAdmin(usersIds: number[]) {
    return await prisma.user.deleteMany({
      where: {
        id: { in: usersIds },
        role: { not: UserRole.ADMIN },
      },
    });
  }

  async deleteUserAccount(userId: number) {
    return await prisma.user.delete({
      where: {
        id: userId,
        role: { not: UserRole.ADMIN },
      },
    });
  }

  async getAdminsCount() {
    return await prisma.user.count({
      where: {
        role: UserRole.ADMIN,
      },
    });
  }

  async changeUserRoleAdmin(userId: number, userNewRole: UserRole) {
    return await prisma.user.update({
      data: {
        role: userNewRole,
      },
      where: {
        id: userId,
      },
    });
  }

  async changeUserPasswordAdmin(userId: number, newPassword: string) {
    return await prisma.user.update({
      data: {
        password: newPassword,
      },
      where: {
        id: userId,
      },
    });
  }

  async updateUserInfo(userId: number, newInfo: UpdateUserInfoDto) {
    return await prisma.user.update({
      data: {
        ...newInfo,
      },
      where: {
        id: userId,
      },
    });
  }

  async getUsersCreatedBetween(start: Date, end: Date) {
    return prisma.user.count({
      where: { created_at: { gte: start, lt: end } },
    });
  }

  async getRecentUsers(limit: number) {
    return prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        created_at: true,
        block_expires_at: true,
        email: true,
        username: true,
        role: true,
      },
      take: limit,
    });
  }
}
