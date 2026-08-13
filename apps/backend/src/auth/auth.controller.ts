import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/refresh-token.guard';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { LoginOtpDto, SignupOtpDto } from './dto/otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { MeResponseDto } from './dto/auth.response.dto';
import { CreateUserDto } from '../user/dto/user.dto';
import { MessageResponseDto } from '../common/dto/response.dto';
import { UserRole } from '../generated/prisma';
import { getRefreshTokenFromRequest } from './cookies.util';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MessageResponseDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MessageResponseDto })
  @Post('admin/login')
  async adminLogin(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto, true);
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('login-verify')
  async loginVerify(
    @Body() otpDto: LoginOtpDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const tokens = await this.authService.verifyOtp(otpDto);
    this.authService.setAuthCookies(res, tokens);
    return { message: 'Logged in successfully' };
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('admin/login-verify')
  async adminLoginVerify(
    @Body() otpDto: LoginOtpDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const tokens = await this.authService.verifyOtp(otpDto, true);
    this.authService.setAuthCookies(res, tokens);
    return { message: 'Logged in successfully' };
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    return await this.authService.signup(signupDto);
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @Post('signup-verify')
  async signupVerify(
    @Body() signupOtpDto: SignupOtpDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const tokens = await this.authService.verifyOtp(signupOtpDto);
    this.authService.setAuthCookies(res, tokens);
    return { message: 'Signed up successfully' };
  }

  @ApiOkResponse({ type: MeResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return await this.authService.me(req.user);
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return await this.authService.changePassword(
      req.user.email,
      changePasswordDto.current_password,
      changePasswordDto.new_password,
    );
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('admin/forget-password')
  async adminForgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.authService.forgetPassword(forgetPasswordDto.email, true);
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @Put('admin/reset-password')
  async adminResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto, true);
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const refreshToken = getRefreshTokenFromRequest(req);
    const { userId } = req.user as { userId: number; email: string };
    const tokens = await this.authService.refresh(userId, refreshToken ?? '');
    this.authService.setAuthCookies(res, tokens);
    return { message: 'Token refreshed successfully' };
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const refreshToken = getRefreshTokenFromRequest(req);
    await this.authService.logoutByToken(refreshToken);
    this.authService.clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }

  @ApiOkResponse({ type: MessageResponseDto })
  @Post('internal/cleanup-otp')
  @HttpCode(HttpStatus.OK)
  async cleanupOtp(@Headers('x-cron-secret') secret: string) {
    return await this.authService.cleanupOtp(secret);
  }

  @Get('google')
  @UseGuards(new (AuthGuard('google'))({ state: 'admin', session: false }))
  async googleAuth() {}

  @Get('google/frontend')
  @UseGuards(new (AuthGuard('google'))({ state: 'frontend', session: false }))
  async googleAuthFrontend() {}

  @Get('google/admin')
  @UseGuards(new (AuthGuard('google-admin'))({ session: false }))
  async googleAdminAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const tokens = await this.authService.jwtGenerator(user.id, user.email);
    this.authService.setAuthCookies(res, tokens);
    const state = (req.query.state as string) || '';
    const frontendUrls: Record<string, string> = {
      admin: process.env.FRONTEND_URL || 'http://localhost:5173',
      frontend: process.env.FILMAM_URL || 'http://localhost:3000',
    };
    const frontendUrl = frontendUrls[state] || frontendUrls.admin;
    const html = `
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { success: true },
            "${frontendUrl}"
          );
          window.close();
        </script>
      </body>
    </html>
  `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('google/admin/callback')
  @UseGuards(AuthGuard('google-admin'))
  async googleAdminAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (user.role !== UserRole.ADMIN) {
      const html = `
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { error: "Only admin users can access the admin panel" },
            "${frontendUrl}"
          );
          window.close();
        </script>
      </body>
    </html>
    `;
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
      return;
    }

    const tokens = await this.authService.jwtGenerator(user.id, user.email);
    this.authService.setAuthCookies(res, tokens);
    const html = `
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { success: true },
            "${frontendUrl}"
          );
          window.close();
        </script>
      </body>
    </html>
  `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
