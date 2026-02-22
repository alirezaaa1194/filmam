import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: String(process.env.JWT_ACCESS_SECRET),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      user.role !== UserRole.ADMIN &&
      user.block_expires_at &&
      user.block_expires_at > new Date()
    ) {
      throw new ForbiddenException('Account is temporarily blocked');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
