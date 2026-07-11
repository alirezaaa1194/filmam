import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserType } from '../types/auth.type';
import { UserRole } from '../../generated/prisma';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;
    const userInfo: UserType | null = await this.userService.getUserByEmail(
      user.email,
    );
    return !!userInfo && userInfo.role === UserRole.ADMIN;
  }
}
