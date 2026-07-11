import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateGenreTranslationDto } from '../../genre-translation/dto/genre-translation.dto';
import { AppLanguage } from '../../generated/prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { appLanguages } from '../../lib/utils';

export class CreateGenreDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    type: [CreateGenreTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGenreTranslationDto)
  @ArrayMinSize(appLanguages.length)
  translations: CreateGenreTranslationDto[];
}

export class DeleteGenresDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  genre_ids: number[];
}

export class GetAllGenresDto extends CommonQueryParamsDto {}

export class GetGenreDto {
  @ApiPropertyOptional({
    name: 'lang',
    required: false,
  })
  @IsOptional()
  @IsString()
  lang: AppLanguage;
}
