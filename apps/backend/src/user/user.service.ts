import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { GoogleAuthDto } from '../auth/dto/google-auth.dto';
import { UserRole } from '@prisma/client';
import {
  ChangeUserPasswordAdminDto,
  CreateUserDto,
  DeleteUsersDto,
  GetAllUserMovieDto,
  GetAllUsersDto,
  UpdateUserInfoDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { paginationCalculator } from '../lib/utils';
import { UserMovieService } from '../user-movie/user-movie.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userMovieService: UserMovieService,
  ) {}

  async getUserByEmail(userEmail: string) {
    const user = await this.userRepository.getUserByEmail(userEmail);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.getUserById(userId);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async signupUser(userInfo: CreateUserDto | GoogleAuthDto) {
    const usersCount = await this.userRepository.getUsersCount();
    const userRole = usersCount ? UserRole.USER : UserRole.ADMIN;
    return await this.userRepository.createUser(userInfo, userRole);
  }

  async createUserAdmin(userInfo: CreateUserDto) {
    const { email, password } = userInfo;
    const user = await this.getUserByEmail(email);
    if (user) {
      throw new ConflictException('User with this email already exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.signupUser({ ...userInfo, password: hashedPassword });
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
      blocked: query.blocked || false,
    };
    return await this.userRepository.getAllUsersAdmin(allQuery);
  }

  async changeUserPassword(email: string, newPassword: string) {
    return await this.userRepository.changeUserPassword(email, newPassword);
  }

  async blockUser(userId: number, expireTime: Date | null) {
    if (
      expireTime &&
      Date.parse(expireTime.toString()) < Date.parse(new Date().toString())
    ) {
      throw new BadRequestException(
        'block_expires_at must be greater than now time',
      );
    }
    return await this.userRepository.blockUser(userId, expireTime);
  }

  async deleteUserAdmin(body: DeleteUsersDto) {
    const deletedUsers = await this.userRepository.deleteUserAdmin(
      body.users_ids,
    );
    if (deletedUsers.count === 0) {
      throw new NotFoundException('user not found');
    }
  }

  async deleteUserAccount(userId: number) {
    return await this.userRepository.deleteUserAccount(userId);
  }

  async getAdminsCount() {
    return await this.userRepository.getAdminsCount();
  }

  async changeUserRoleAdmin(userId: number) {
    const adminsCount = await this.getAdminsCount();
    const user = await this.getUserById(userId);
    const userNewRole =
      user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    if (adminsCount > 1 || userNewRole === UserRole.ADMIN) {
      return await this.userRepository.changeUserRoleAdmin(userId, userNewRole);
    } else {
      throw new BadRequestException('Admins count can not be lower than one');
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

  // async getAllUserMovies(userId: number, query: GetAllUserMovieDto) {
  //   return await this.userMovieService.getAllUserMovies(userId, query);
  // }
}
