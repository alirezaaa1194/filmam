import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Is_Admin_Key } from '../../common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { UserType } from '../auth.type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAdminRoute = this.reflector.getAllAndOverride<boolean>(
      Is_Admin_Key,
      [context.getHandler(), context.getClass()],
    );
    if (!isAdminRoute) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) return false;
    const userInfo: UserType | null = await this.userService.getUserByEmail(
      user.email,
    );
    return !!userInfo && userInfo.role === UserRole.ADMIN;
  }
}
