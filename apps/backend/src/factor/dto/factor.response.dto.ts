import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage, FactorFileType, MovieType, SourceType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';
import { MovieFileResponseDto } from '../../movie/dto/movie.response.dto';

export class FactorTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiProperty()
  factor_id!: number;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class FactorUploadDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  mime_type!: string;

  @ApiPropertyOptional()
  file_name?: string;

  @ApiProperty({ enum: SourceType })
  source_type!: SourceType;

  @ApiPropertyOptional()
  alt_text?: string;

  @ApiPropertyOptional()
  size?: number;

  @ApiPropertyOptional()
  width?: string;

  @ApiPropertyOptional()
  height?: string;

  @ApiPropertyOptional()
  duration?: string;
}

export class FactorFileDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  mime_type!: string;

  @ApiPropertyOptional()
  file_name?: string;

  @ApiProperty({ enum: FactorFileType })
  type!: FactorFileType;
}

export class FactorProfileDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  factor_id!: number;

  @ApiProperty()
  upload_id!: number;

  @ApiProperty({ enum: FactorFileType })
  type!: FactorFileType;

  @ApiProperty()
  path!: string;
}

export class FactorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ type: [FactorTranslationDto] })
  translations!: FactorTranslationDto[];

  @ApiPropertyOptional({ type: FactorUploadDto })
  profile?: FactorUploadDto;
}

export class FactorDetailDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiPropertyOptional({ type: FactorUploadDto })
  profile?: FactorUploadDto;

  @ApiProperty({ type: [FactorTranslationDto] })
  translations!: FactorTranslationDto[];
}

export class FactorListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiPropertyOptional({ type: FactorProfileDto })
  profile?: FactorProfileDto;
}

export class PaginatedFactorsDto extends PaginationMetaDto {
  @ApiProperty({ type: [FactorListDto] })
  data!: FactorListDto[];
}

export class FactorMovieListItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ enum: MovieType })
  type!: MovieType;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  age_limit?: number;

  @ApiProperty()
  released_year!: number;

  @ApiProperty()
  likes_count!: number;

  @ApiProperty()
  dislikes_count!: number;

  @ApiProperty()
  watches_count!: number;

  @ApiProperty()
  combined_tags!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
}

export class PaginatedFactorMoviesDto extends PaginationMetaDto {
  @ApiProperty({ type: [FactorMovieListItemDto] })
  data!: FactorMovieListItemDto[];
}
