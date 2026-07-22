import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSeasonTranslationDto } from '../../season-translation/dto/season-translation.dto';
import { Type } from 'class-transformer';
import { appLanguages } from '../../lib/utils';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSeasonFileDto } from '../../season-file/dto/season-file.dto';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { RequiredTranslations } from '../../common/decorators/required-translations.decorator';

export class CreateSeasonDto {
  @ApiProperty({
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  order!: number;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiProperty({
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  movie_id!: number;

  @ApiProperty({
    type: [CreateSeasonTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeasonTranslationDto)
  @ArrayMinSize(appLanguages.length)
  @RequiredTranslations()
  translations!: CreateSeasonTranslationDto[];

  @ApiProperty({
    type: [CreateSeasonFileDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeasonFileDto)
  files!: CreateSeasonFileDto[];
}

export class DeleteSeasonsDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  season_ids!: number[];
}

export class GetAllSeasonsDto extends CommonQueryParamsDto {}

export class GetSeasonEpisodesDto extends CommonQueryParamsDto {}


