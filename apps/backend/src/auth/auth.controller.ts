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
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtAuthGuard as RefreshJwtAuthGuard } from './guards/refresh-token.guard';
import { RoleGuard } from './guards/role.guard';
import { Admin } from '../common/decorators/role.decorator';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { LoginOtpDto, SignupOtpDto } from './dto/otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MeResponseDto } from './dto/me.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verify(@Body() otpDto: LoginOtpDto) {
    return await this.authService.verifyOtp(otpDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() signupDto: SignUpDto) {
    return await this.authService.signup(signupDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
  })
  @Post('signup-verify')
  async signupVerify(@Body() signupOtpDto: SignupOtpDto) {
    return await this.authService.verifyOtp(signupOtpDto);
  }

  // @Admin()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiResponse({ type: MeResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return await this.authService.me(req.user);
  }

  @ApiResponse({
    status: 204,
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth()
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

  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
  })
  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@Request() req) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.refresh(req.user.userId, refreshToken);
  }

  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiBearerAuth()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const tokens = await this.authService.jwtGenerator(user.id, user.email);
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
