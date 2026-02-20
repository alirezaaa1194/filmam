import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtAuthGuard as RefreshJwtAuthGuard } from './local-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Admin } from '../common/decorators/role.decorator';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { OtpDto, SignupOtpDto } from './dto/otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { OtpType } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verify(@Body() otpDto: OtpDto) {
    return await this.authService.verifyOtp(otpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return await this.authService.signup(signupDto);
  }

  @Post('signup-verify')
  async signupVerify(@Body() signupOtpDto: SignupOtpDto) {
    return await this.authService.verifyOtp(signupOtpDto);
  }

  // @Admin()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return await this.authService.me(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return await this.authService.changePassword(
      req.user.email,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@Request() req) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.refresh(req.user.userId, refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(RefreshJwtAuthGuard)
  async logout(@Request() req) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.logout(req.user.userId, refreshToken);
  }

  @Post('internal/cleanup-otp')
  @HttpCode(HttpStatus.OK)
  async cleanupOtp(@Headers('x-cron-secret') secret: string) {
    return await this.authService.cleanupOtp(secret);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const tokens = await this.authService.jwtGenerator(user.id, user.email);
    // return { message: 'Login successful', ...tokens };

    const html = `
    <html>
      <body>
        <script>
          window.opener.postMessage(
            {
              accessToken: "${tokens.accessToken}",
              refreshToken: "${tokens.refreshToken}"
            },
            "http://localhost:3000"
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
