import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { defaultLang } from '../../lib/utils';

export class CreateSeasonTranslationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: defaultLang, required: true })
  @IsEnum(AppLanguage)
  @IsNotEmpty()
  language: AppLanguage;
}
