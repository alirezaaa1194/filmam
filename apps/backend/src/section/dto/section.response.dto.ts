import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SectionViewMode,
  SectionSelectionMode,
  SectionSortMode,
  SectionPeriodBase,
  SectionFilterKey,
  AppLanguage,
} from '../../generated/prisma';
import { MovieListItemDto } from '../../movie/dto/movie.response.dto';
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

  @ApiProperty({ type: [MovieListItemDto] })
  movies!: MovieListItemDto[];
}

export class PaginatedSectionsDto extends PaginationMetaDto {
  @ApiProperty({ type: [SectionListItemDto] })
  data!: SectionListItemDto[];
}
