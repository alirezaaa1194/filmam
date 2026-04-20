import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { appLanguages } from '../../lib/utils';
import { AppLanguage } from '@prisma/client';

export class CreateMovieFactorTranslationDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  role_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lang: AppLanguage;
}

export class CreateMovieFactorsDto {
  @ApiProperty({
    example: 1,
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  factor_id: number;

  @ApiProperty({
    example: 1,
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  role_id: number;

  @ApiProperty({
    example: 1,
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  order: number;

  @ApiProperty({
    type: [CreateMovieFactorTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieFactorTranslationDto)
  @ArrayMinSize(appLanguages.length)
  translations: CreateMovieFactorTranslationDto[];
}

export class GetFactorMoviesDto extends CommonQueryParamsDto {}
