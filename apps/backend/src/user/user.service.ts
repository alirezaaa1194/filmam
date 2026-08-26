import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { GoogleAuthDto } from '../auth/dto/google-auth.dto';
import {
  BlockUserDto,
  ChangeUserPasswordAdminDto,
  CreateUserDto,
  DeleteUsersDto,
  GetAllUsersDto,
  UpdateUserInfoDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { paginationCalculator } from '../lib/utils';
import { UserRole } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { TransactionType } from '../common/types/types';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserByEmail(userEmail: string, tx?: TransactionType) {
    return await this.userRepository.getUserByEmail(userEmail, tx);
  }

  async getUserById(userId: number, tx?: TransactionType) {
    const user = await this.userRepository.getUserById(userId, tx);
    if (user) {
      const { password, ...otherUserData } = user;
      return otherUserData;
    } else {
      throw new NotFoundException('user not found');
    }
  }

  async signupUser(
    userInfo: CreateUserDto | GoogleAuthDto,
    tx?: TransactionType,
  ) {
    const usersCount = await this.userRepository.getUsersCount();
    const userRole = usersCount ? UserRole.USER : UserRole.ADMIN;
    return await this.userRepository.createUser(userInfo, userRole, tx);
  }

  async createUserAdmin(userInfo: CreateUserDto, tx?: TransactionType) {
    const { email, password } = userInfo;
    const user = await this.getUserByEmail(email, tx);
    if (user) {
      throw new ConflictException('User with this email already exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.signupUser({ ...userInfo, password: hashedPassword }, tx);
    }
  }

  async getAllUsersAdmin(query: GetAllUsersDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const allQuery = {
      page,
      page_size,
      search: query.search?.trim() || '',
      sort: query.sort || 'desc',
      blocked: query.blocked,
    };
    const [users, usersCount] = await Promise.all([
      this.userRepository.getAllUsersAdmin(allQuery),
      this.userRepository.getAllUsersCount(allQuery),
    ]);

    return {
      page: page + 1,
      page_size,
      count: usersCount,
      data: users,
    };
  }

  async changeUserPassword(
    email: string,
    newPassword: string,
    tx?: TransactionType,
  ) {
    return await this.userRepository.changeUserPassword(
      email,
      newPassword,
      tx,
    );
  }

  async blockUsers(body: BlockUserDto) {
    return await this.userRepository.blockUsers(body);
  }

  async blockUser(
    userId: number,
    expireTime: Date | null,
    tx?: TransactionType,
  ) {
    return await this.userRepository.blockUser(userId, expireTime, tx);
  }

  async deleteUserAdmin(body: DeleteUsersDto, adminId: number) {
    const userIds = body.users_ids.filter((userId) => userId !== adminId);

    if (!userIds.length) {
      throw new ForbiddenException('You can not delete yourself!');
    }

    const result = await prisma.$transaction(async (tx) => {
      const users = await this.userRepository.findUsers(userIds, tx);
      if (userIds.length === 1 && users[0].role === UserRole.ADMIN) {
        throw new ForbiddenException(
          'You can not delete user by admin Role. first change role to user, then delete',
        );
      }
      const deletedUsers = await this.userRepository.deleteUserAdmin(userIds);
      if (deletedUsers.count === 0) {
        throw new NotFoundException('User not found');
      }
      return { message: 'Users deleted successfully' };
    });
    return result;
  }

  async deleteUserAccount(userId: number) {
    const userInfo = await this.userRepository.getUserById(userId);

    if (!userInfo) {
      throw new NotFoundException('User not found');
    }

    const adminsCount = await this.getAdminsCount();

    if (userInfo.role === UserRole.ADMIN && adminsCount === 1) {
      throw new ForbiddenException('Admins count can not be lower than one');
    }

    return await this.userRepository.deleteUserAccount(userId);
  }

  async getAdminsCount() {
    return await this.userRepository.getAdminsCount();
  }

  async changeUserRoleAdmin(userId: number, adminId: number) {
    if (userId === adminId) {
      throw new ForbiddenException('You can not change your role!');
    }

    const adminsCount = await this.getAdminsCount();
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userNewRole =
      user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    if (adminsCount > 1 || userNewRole === UserRole.ADMIN) {
      return await this.userRepository.changeUserRoleAdmin(userId, userNewRole);
    } else {
      throw new ForbiddenException('Admins count can not be lower than one');
    }
  }

  async changeUserPasswordAdmin(
    userId: number,
    body: ChangeUserPasswordAdminDto,
  ) {
    const hashedNewPassword = await bcrypt.hash(body.new_password, 10);
    return await this.userRepository.changeUserPasswordAdmin(
      userId,
      hashedNewPassword,
    );
  }

  async updateUserInfo(userId: number, newInfo: UpdateUserInfoDto) {
    return await this.userRepository.updateUserInfo(userId, newInfo);
  }
}