import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage, MovieType } from '@prisma/client';
import { CreateMovieTranslationDto } from '../../movie-translation/dto/movie-translation.dto';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
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
    name: 'lang',
    example: defaultLang,
    required: false,
    default: defaultLang,
  })
  @IsEnum(AppLanguage)
  @IsOptional()
  lang?: AppLanguage;

  @ApiProperty({
    name: 'page',
    example: 1,
    required: false,
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    name: 'page_size',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  page_size?: number = 10;

  @ApiProperty({
    name: 'genres',
    example: [1, 2, 3],
    required: false,
    type: [Number],
    isArray: true,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  genres?: number[];

  @ApiProperty({
    name: 'age_limits',
    example: [12, 15, 18],
    required: false,
    type: [Number],
    isArray: true,
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(18, { each: true })
  @IsOptional()
  @Type(() => Number)
  age_limits?: number[];

  @ApiProperty({
    name: 'countries',
    example: ['us', 'uk', 'ir'],
    required: false,
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countries?: string[];

  @ApiProperty({
    name: 'tags',
    example: ['trending', 'popular', 'new'],
    required: false,
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    name: 'languages',
    example: ['fa', 'en', 'ar'],
    required: false,
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiProperty({
    name: 'sort_by',
    example: 'created_at',
    required: false,
    enum: SortByType,
    default: SortByType.CREATED_AT,
  })
  @IsEnum(SortByType)
  @IsOptional()
  sort_by?: SortByType;

  @ApiProperty({
    name: 'sort_order',
    example: 'DESC',
    required: false,
    enum: SortType,
    default: SortType.DESC,
  })
  @IsEnum(SortType)
  @IsOptional()
  sort_order?: SortType;

  @ApiProperty({
    name: 'type',
    example: 'MOVIE',
    required: false,
    enum: MovieType,
  })
  @IsEnum(MovieType)
  @IsOptional()
  type?: MovieType;
}
