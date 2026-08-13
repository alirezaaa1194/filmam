import { Injectable } from '@nestjs/common';
import { UserRole } from '../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { GoogleAuthDto } from '../../auth/dto/google-auth.dto';
import {
  BlockUserDto,
  CreateUserDto,
  UpdateUserInfoDto,
} from '../dto/user.dto';
import { TransactionType } from '../../common/types/types';

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

  async findUsers(userIds: number[], tx: TransactionType) {
    return await tx.user.findMany({ where: { id: { in: userIds } } });
  }

  async blockUsers(body: BlockUserDto) {
    return await prisma.user.updateMany({
      data: { block_expires_at: body.block_expires_at },
      where: { id: { in: body.users_ids }, role: { not: UserRole.ADMIN } },
    });
  }

  async blockUser(userId: number, expireTime: Date | null) {
    return await prisma.user.update({
      data: { block_expires_at: expireTime },
      where: { id: userId, role: { not: UserRole.ADMIN } },
    });
  }

  private buildUsersWhere(query: { search: string; blocked?: boolean }) {
    return {
      OR: [
        {
          username: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        },
        {
          email: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        },
      ],
      AND: {
        ...(query.blocked === undefined
          ? {}
          : query.blocked
            ? { block_expires_at: { gt: new Date() } }
            : {
                block_expires_at: {
                  OR: [{ equals: null }, { lte: new Date() }],
                },
              }),
      },
    };
  }

  async getAllUsersAdmin(query: {
    page: number;
    page_size: number;
    search: string;
    sort: 'asc' | 'desc';
    blocked?: boolean;
  }) {
    return await prisma.user.findMany({
      skip: query.page,
      take: query.page_size,
      where: this.buildUsersWhere(query),
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        username: true,
        email: true,
        google_id: true,
        role: true,
        block_expires_at: true,
        preferred_language: true,
      },
      orderBy: {
        created_at: query.sort,
      },
    });
  }

  async getAllUsersCount(query: { search: string; blocked?: boolean }) {
    return await prisma.user.count({
      where: this.buildUsersWhere(query),
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
