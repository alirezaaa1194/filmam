import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage, EpisodeFileType, SourceType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';
import { MovieDetailPublicResponseDto } from '../../movie/dto/movie.response.dto';

export class EpisodeFileResponseDto {
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

  @ApiPropertyOptional()
  intro_start_time?: number;

  @ApiPropertyOptional()
  intro_duration?: number;

  @ApiPropertyOptional()
  outro_duration?: number;
}

export class EpisodeTranslationDto {
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
  episode_id!: number;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class EpisodeDetailAdminResponseDto {
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
  season_id!: number;

  @ApiProperty()
  movie_id!: number;

  @ApiProperty()
  likes_count!: number;

  @ApiProperty()
  dislikes_count!: number;

  @ApiProperty()
  watches_count!: number;

  @ApiPropertyOptional({ type: [EpisodeFileResponseDto] })
  files?: EpisodeFileResponseDto[];

  @ApiPropertyOptional({ type: [EpisodeTranslationDto] })
  translations?: EpisodeTranslationDto[];
}

export class EpisodeDetailSeasonDto {
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
  title!: string;
}

export class EpisodeDetailNextEpisodeDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  season_id!: number;

  @ApiProperty()
  movie_id!: number;

  @ApiProperty()
  likes_count!: number;

  @ApiProperty()
  dislikes_count!: number;

  @ApiProperty()
  watches_count!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  season_title!: string;
}

export class EpisodeDetailPublicResponseDto {
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
  season_id!: number;

  @ApiProperty()
  movie_id!: number;

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

  @ApiProperty({ type: [EpisodeFileResponseDto] })
  files!: EpisodeFileResponseDto[];

  @ApiProperty({ type: MovieDetailPublicResponseDto })
  movie!: MovieDetailPublicResponseDto;

  @ApiProperty({ type: EpisodeDetailSeasonDto })
  season!: EpisodeDetailSeasonDto;

  @ApiPropertyOptional({ type: EpisodeDetailNextEpisodeDto })
  next_episode?: EpisodeDetailNextEpisodeDto;
}

export class EpisodeListItemDto {
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
  season_id!: number;

  @ApiProperty()
  movie_id!: number;

  @ApiProperty()
  likes_count!: number;

  @ApiProperty()
  dislikes_count!: number;

  @ApiProperty()
  watches_count!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  movie_title!: string;

  @ApiProperty()
  season_title!: string;

  @ApiProperty()
  movie_season_count!: number;

  @ApiProperty({ type: [EpisodeFileResponseDto] })
  files!: EpisodeFileResponseDto[];
}

export class PaginatedEpisodesDto extends PaginationMetaDto {
  @ApiProperty({ type: [EpisodeListItemDto] })
  data!: EpisodeListItemDto[];
}
