import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SectionViewMode,
  SectionSelectionMode,
  SectionSortMode,
  SectionPeriodBase,
  SectionFilterKey,
  AppLanguage,
  MovieType,
} from '../../generated/prisma';
import { MovieFileResponseDto, MovieListItemDto } from '../../movie/dto/movie.response.dto';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class SectionFilterDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: SectionFilterKey })
  filter_key!: SectionFilterKey;

  @ApiProperty()
  filter_value!: string;
}

export class SectionTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class SectionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({ enum: SectionViewMode })
  view_mode!: SectionViewMode;

  @ApiProperty({ enum: SectionSelectionMode })
  selection_mode!: SectionSelectionMode;

  @ApiPropertyOptional({ enum: SectionSortMode })
  sort_mode?: SectionSortMode;

  @ApiPropertyOptional({ enum: SectionPeriodBase })
  period_base?: SectionPeriodBase;

  @ApiProperty({ type: [SectionTranslationDto] })
  translations!: SectionTranslationDto[];

  @ApiProperty({ type: [SectionFilterDto] })
  section_filters!: SectionFilterDto[];

  @ApiProperty({ type: [MovieListItemDto] })
  movies!: MovieListItemDto[];
}

export class SectionDetailResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({ enum: SectionViewMode })
  view_mode!: SectionViewMode;

  @ApiProperty({ enum: SectionSelectionMode })
  selection_mode!: SectionSelectionMode;

  @ApiPropertyOptional({ enum: SectionSortMode })
  sort_mode?: SectionSortMode;

  @ApiPropertyOptional({ enum: SectionPeriodBase })
  period_base?: SectionPeriodBase;

  @ApiProperty({ type: [SectionTranslationDto] })
  translations!: SectionTranslationDto[];

  @ApiProperty({ type: [SectionFilterDto] })
  section_filters!: SectionFilterDto[];

  @ApiProperty({ type: [MovieListItemDto] })
  section_movies!: MovieListItemDto[];
}

export class SectionMovieListItemDto {
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
  title!: string;

  @ApiProperty()
  short_description!: string;

  @ApiPropertyOptional()
  seasons_count?: number;

  @ApiPropertyOptional()
  episodes_count?: number;

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
}

export class SectionListItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({ enum: SectionViewMode })
  view_mode!: SectionViewMode;

  @ApiProperty({ enum: SectionSelectionMode })
  selection_mode!: SectionSelectionMode;

  @ApiPropertyOptional({ enum: SectionSortMode })
  sort_mode?: SectionSortMode;

  @ApiPropertyOptional({ enum: SectionPeriodBase })
  period_base?: SectionPeriodBase;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  filter?: string;

  @ApiProperty({ type: [SectionFilterDto] })
  section_filters!: SectionFilterDto[];

  @ApiProperty({ type: [SectionMovieListItemDto] })
  movies!: SectionMovieListItemDto[];
}

export class SectionAdminListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({ enum: SectionViewMode })
  view_mode!: SectionViewMode;

  @ApiProperty({ enum: SectionSelectionMode })
  selection_mode!: SectionSelectionMode;

  @ApiPropertyOptional({ enum: SectionSortMode })
  sort_mode?: SectionSortMode;

  @ApiPropertyOptional({ enum: SectionPeriodBase })
  period_base?: SectionPeriodBase;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  movies_count!: number;
}

export class PaginatedAdminSectionsDto extends PaginationMetaDto {
  @ApiProperty({ type: [SectionAdminListDto] })
  data!: SectionAdminListDto[];
}

export class PaginatedSectionsDto extends PaginationMetaDto {
  @ApiProperty({ type: [SectionListItemDto] })
  data!: SectionListItemDto[];
}
