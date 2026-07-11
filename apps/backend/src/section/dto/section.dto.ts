import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AppLanguage,
  SectionFilterKey,
  SectionPeriodBase,
  SectionSelectionMode,
  SectionSortMode,
  SectionViewMode,
} from '../../generated/prisma';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateSectionTranslationDto } from '../../section-translation/dto/section-translation.dto';
import { CreateSectionMovieDto } from '../../section-movie/dto/section-movie.dto';
import { Type } from 'class-transformer';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { appLanguages } from '../../lib/utils';

export class CreateSectionDto {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ type: 'number', example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  order: number;

  @ApiProperty({
    example: SectionViewMode.NORMAL_SLIDER,
    required: true,
  })
  @IsEnum(SectionViewMode)
  @IsNotEmpty()
  view_mode: SectionViewMode;

  @ApiProperty({
    example: SectionSelectionMode.AUTO,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(SectionSelectionMode)
  selection_mode: SectionSelectionMode;

  @ApiProperty({
    example: SectionSortMode.NEWEST,
    required: true,
  })
  @IsEnum(SectionSortMode)
  @IsOptional()
  sort_mode?: SectionSortMode;

  @ApiProperty({
    example: SectionPeriodBase.A_WEEK_AGO,
    required: true,
  })
  @IsEnum(SectionPeriodBase)
  @IsOptional()
  period_base?: SectionPeriodBase;

  @ApiProperty({
    type: [CreateSectionTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(appLanguages.length)
  translations: CreateSectionTranslationDto[];

  @ApiProperty({
    type: [CreateSectionMovieDto],
    required: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  section_movies?: CreateSectionMovieDto[];

  @ApiProperty({
    required: true,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  filters: SectionMovieFilter[];
}

export class SectionMovieFilter {
  @ApiProperty({
    example: SectionFilterKey.GENRES,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(SectionFilterKey)
  filter_key: SectionFilterKey;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  filter_value: string;
}

export class DeleteSectionsDto {
  @ApiProperty({ example: [1, 2, 3], required: true })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false }, { each: true })
  sections_ids: number[];
}

export class GetAllSectionsDto extends CommonQueryParamsDto {
  @ApiPropertyOptional({
    name: 'movies_size',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  movies_size?: number;
}

export class GetSectionDetailDto {
  @ApiPropertyOptional({
    name: 'lang',
    required: false,
  })
  @IsString()
  @IsOptional()
  lang?: AppLanguage;
}
