import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryTranslationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lang!: AppLanguage;
}


