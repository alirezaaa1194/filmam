import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AppLanguage } from '../../generated/prisma';

export class GoogleAuthDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  google_id!: string;

  @IsOptional()
  @IsEnum(AppLanguage)
  preferred_language?: AppLanguage;
}


