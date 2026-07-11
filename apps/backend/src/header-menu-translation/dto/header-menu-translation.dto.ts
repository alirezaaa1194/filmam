import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { defaultLang } from '../../lib/utils';

export class CreateHeaderMenuTranslationDto {
  @ApiProperty({
    example: defaultLang,
    required: true,
  })
  @IsEnum(AppLanguage)
  @IsNotEmpty()
  language: AppLanguage;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
