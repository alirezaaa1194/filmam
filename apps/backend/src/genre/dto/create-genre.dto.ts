import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { AppLanguage } from 'src/generated/prisma/enums';

export class CreateGenreDto {
  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: {
    language: AppLanguage;
    value: string;
  }[];
}
