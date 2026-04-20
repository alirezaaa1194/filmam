import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../../lib/prisma';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(GoogleStrategy) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/api/auth/google/callback',
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    let user = await this.userService.getUserByEmail(profile.emails[0].value);

    if (!user) {
      user = await this.userService.signupUser({
        email: profile.emails[0].value,
        google_id: profile.id,
        username: profile.displayName,
      });
    }

    if (!user.google_id) {
      user = await prisma.user.update({
        data: { google_id: profile.id },
        where: { id: user.id },
      });
    }

    return user;
  }
}
