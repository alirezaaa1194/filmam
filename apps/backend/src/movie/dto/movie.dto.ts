import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage, MovieType } from '@prisma/client';
import { CreateMovieTranslationDto } from '../../movie-translation/dto/movie-translation.dto';
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
import { Transform, Type } from 'class-transformer';
import { CreateMovieFilesDto } from '../../movie-file/dto/movie-file.dto';
import { CreateMovieFactorsDto } from '../../movie-factor/dto/movie-factor.dto';
import { appLanguages, defaultLang } from '../../lib/utils';
import { SortByType, SortType } from '../../common/enums';

export class CreateMovieDto {
  @ApiProperty({
    example: MovieType.SERIES,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(MovieType)
  type: MovieType;

  @ApiProperty({
    type: 'number',
    example: new Date().getFullYear(),
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  released_year: number;

  @ApiProperty({
    type: 'number',
    example: 14,
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  age_limit: number | null;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  combined_tags: string;

  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  genres: number[];

  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  tags: number[];

  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @ArrayMinSize(1)
  countries: number[];

  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @ArrayMinSize(1)
  languages: number[];

  @ApiProperty({
    type: [CreateMovieFactorsDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieFactorsDto)
  // @ArrayMinSize(8)
  factors: CreateMovieFactorsDto[];

  @ApiProperty({
    type: [CreateMovieTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieTranslationDto)
  @ArrayMinSize(appLanguages.length)
  translations: CreateMovieTranslationDto[];

  @ApiProperty({
    type: [CreateMovieFilesDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieFilesDto)
  files: CreateMovieFilesDto[];
}

export class DeleteMoviesDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  movie_ids: number[];
}

export class GetMovieDetailPublicDto {
  @ApiProperty({
    name: 'lang',
    example: defaultLang,
    required: false,
  })
  @IsEnum(AppLanguage)
  @IsOptional()
  lang?: AppLanguage;
}

export class GetAllMoviesPublicDto {
  @ApiProperty({
    name: 'search',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    name: 'section',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty({
    name: 'lang',
    required: false,
    default: defaultLang,
    enum: AppLanguage,
  })
  @IsEnum(AppLanguage)
  @IsOptional()
  lang?: AppLanguage;

  @ApiProperty({
    name: 'page',
    required: false,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    name: 'page_size',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page_size?: number = 10;

  @ApiProperty({
    name: 'genres',
    required: false,
    type: Number,
    isArray: true,
  })
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsOptional()
  @Type(() => Number)
  genres?: number[];

  @ApiProperty({
    name: 'age_limits',
    required: false,
    type: Number,
    isArray: true,
  })
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsOptional()
  @Type(() => Number)
  age_limits?: number[];

  @ApiProperty({
    name: 'countries',
    required: false,
    type: Number,
    isArray: true,
  })
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsOptional()
  @Type(() => Number)
  countries?: number[];

  @ApiProperty({
    name: 'tags',
    required: false,
    type: Number,
    isArray: true,
  })
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsOptional()
  @Type(() => Number)
  tags?: string[];

  @ApiProperty({
    name: 'languages',
    required: false,
    type: Number,
    isArray: true,
  })
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsOptional()
  @Type(() => Number)
  languages?: string[];

  @ApiProperty({
    name: 'sort_by',
    required: false,
    enum: SortByType,
  })
  @IsEnum(SortByType)
  @IsOptional()
  sort_by?: SortByType;

  @ApiProperty({
    name: 'sort_order',
    required: false,
    enum: SortType,
  })
  @IsEnum(SortType)
  @IsOptional()
  sort_order?: SortType;

  @ApiProperty({
    name: 'type',
    required: false,
    enum: MovieType,
  })
  @IsEnum(MovieType)
  @IsOptional()
  type?: MovieType;
}
