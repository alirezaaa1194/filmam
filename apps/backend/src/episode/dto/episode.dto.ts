import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { appLanguages, defaultLang } from '../../lib/utils';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { CreateEpisodeTranslationDto } from '../../episode-translation/dto/episode-translation.dto';
import { CreateEpisodeFileDto } from '../../episode-file/dto/episode-file.dto';
import { AppLanguage } from '@prisma/client';

export class CreateEpisodeDto {
  @ApiProperty({
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  season_id: number;

  @ApiProperty({
    type: [CreateEpisodeTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEpisodeTranslationDto)
  @ArrayMinSize(appLanguages.length)
  translations: CreateEpisodeTranslationDto[];

  @ApiProperty({
    type: [CreateEpisodeFileDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEpisodeFileDto)
  files: CreateEpisodeFileDto[];
}

export class DeleteEpisodesDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  episode_ids: number[];
}

export class GetAllEpisodesDto extends CommonQueryParamsDto {}

export class GetEpisodeDetailPublicDto {
  @ApiProperty({
    name: 'lang',
    example: defaultLang,
    required: false,
  })
  @IsEnum(AppLanguage)
  @IsOptional()
  lang?: AppLanguage;
}
