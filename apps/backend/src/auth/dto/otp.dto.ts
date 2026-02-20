import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  otp: string | number;
}

export class SignupOtpDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @MinLength(5)
  otp: string | number;
}
