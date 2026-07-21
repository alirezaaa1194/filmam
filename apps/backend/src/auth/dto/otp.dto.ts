import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { AppLanguage } from '../../generated/prisma';
import { defaultLang } from '../../lib/utils';

export class LoginOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'user email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345',
    description: 'sent otp',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  otp: string;
}

export class SignupOtpDto {
  @ApiProperty({
    description: 'username',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'user email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'user password',
    required: true,
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: AppLanguage,
    default: defaultLang,
    required: true,
  })
  @IsEnum(AppLanguage)
  @IsNotEmpty()
  preferred_language!: AppLanguage;

  @ApiProperty({
    example: '12345',
    description: 'sent otp',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  otp: string;
}
