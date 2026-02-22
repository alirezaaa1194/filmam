import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
    example: '12345',
    description: 'sent otp',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  otp: string;
}
