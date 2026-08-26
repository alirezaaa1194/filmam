import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../../lib/prisma';
import { UserService } from '../../user/user.service';
import { TransactionType } from '../../common/types/types';
import { defaultLang } from '../../lib/utils';

@Injectable()
export class AuthAdminStrategy extends PassportStrategy(
  GoogleStrategy,
  'google-admin',
) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_ADMIN_CALLBACK_URL,
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    return await prisma.$transaction(async (tx: TransactionType) => {
      let user = await this.userService.getUserByEmail(profile.emails[0].value, tx);

      if (!user) {
        user = await this.userService.signupUser({
          email: profile.emails[0].value,
          google_id: profile.id,
          username: profile.displayName,
          preferred_language: defaultLang,
        }, tx);
      }

      if (!user.google_id) {
        user = await tx.user.update({
          data: { google_id: profile.id },
          where: { id: user.id },
        });
      }

      return user;
    });
  }
}
