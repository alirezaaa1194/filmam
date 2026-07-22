import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { defaultLang } from '../../lib/utils';

export class CreateSectionTranslationDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: defaultLang,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lang!: AppLanguage;
}


