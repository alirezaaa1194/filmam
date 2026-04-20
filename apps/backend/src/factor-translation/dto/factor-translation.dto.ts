import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { defaultLang } from '../../lib/utils';

export class CreateFactorTranslationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: defaultLang, required: true })
  @IsEnum(AppLanguage)
  @IsNotEmpty()
  lang: AppLanguage;
}
