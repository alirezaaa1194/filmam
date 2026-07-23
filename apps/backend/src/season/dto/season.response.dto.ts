import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage, EpisodeFileType, SeasonFileType, SourceType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';
import { EpisodeListItemDto } from '../../episode/dto/episode.response.dto';

export class SeasonFileResponseDto {
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

  @ApiProperty({ enum: SeasonFileType })
  type!: SeasonFileType;

  @ApiPropertyOptional()
  intro_start_time?: number;

  @ApiPropertyOptional()
  intro_duration?: number;

  @ApiPropertyOptional()
  outro_duration?: number;
}

export class SeasonResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  movie_id!: number;

  @ApiProperty({ type: [SeasonFileResponseDto] })
  files!: SeasonFileResponseDto[];
}

export class SeasonTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  short_description!: string;

  @ApiProperty()
  season_id!: number;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class SeasonDetailMovieTranslationDto {
  @ApiProperty()
  title!: string;
}

export class SeasonDetailMovieDto {
  @ApiProperty({ type: [SeasonDetailMovieTranslationDto] })
  translations!: SeasonDetailMovieTranslationDto[];
}

export class SeasonDetailResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  movie_id!: number;

  @ApiProperty({ type: [SeasonTranslationDto] })
  translations!: SeasonTranslationDto[];

  @ApiProperty({ type: SeasonDetailMovieDto })
  movie!: SeasonDetailMovieDto;

  @ApiProperty()
  episodes_count!: number;

  @ApiProperty({ type: [SeasonFileResponseDto] })
  files!: SeasonFileResponseDto[];
}

export class SeasonListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  movie_id!: number;

  @ApiProperty()
  movie_title!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: [SeasonFileResponseDto] })
  files!: SeasonFileResponseDto[];

  @ApiProperty()
  episodes_count!: number;
}

export class PaginatedSeasonsDto extends PaginationMetaDto {
  @ApiProperty({ type: [SeasonListDto] })
  data!: SeasonListDto[];
}

export class SeasonEpisodeFileResponseDto {
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

  @ApiProperty({ enum: EpisodeFileType })
  type!: EpisodeFileType;
}

export class SeasonEpisodeListItemDto extends EpisodeListItemDto {
  @ApiProperty({ type: [SeasonEpisodeFileResponseDto] })
  declare files: SeasonEpisodeFileResponseDto[];

  @ApiProperty()
  watch_progress_time!: number;
}

export class PaginatedSeasonEpisodesDto extends PaginationMetaDto {
  @ApiProperty({ type: [SeasonEpisodeListItemDto] })
  data!: SeasonEpisodeListItemDto[];
}
