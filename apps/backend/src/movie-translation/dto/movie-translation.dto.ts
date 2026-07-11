import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AppLanguage } from '../../generated/prisma';

export class CreateMovieTranslationDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  short_description: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'FA',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  language: AppLanguage;
}
