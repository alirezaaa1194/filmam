import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: '12345678',
    description: 'user current password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({
    example: '12345678',
    description: 'user new password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class ForgetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'user email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
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
    description: 'user new password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    example: '12345',
    description: 'sent otp',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  otp: string;
}
