import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLanguageTranslationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lang: AppLanguage;
}
