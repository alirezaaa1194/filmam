import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { AppLanguage } from '@prisma/client';

export class CreateGenreDto {
  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: {
    language: AppLanguage;
    value: string;
  }[];
}
