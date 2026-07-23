import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserMovieType, CommentEntityType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class UserMovieActionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ enum: UserMovieType })
  type!: UserMovieType;

  @ApiProperty()
  progress_time!: number | null;

  @ApiProperty()
  user_id!: number;

  @ApiProperty()
  movie_id!: number | null;

  @ApiProperty()
  episode_id!: number | null;

  @ApiProperty({ enum: CommentEntityType })
  entity_type!: CommentEntityType;
}

class MovieBriefDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  poster_url?: string;

  @ApiPropertyOptional()
  rating?: number;

  @ApiPropertyOptional()
  release_date?: Date;

  @ApiPropertyOptional()
  imdb_id?: string;

  @ApiPropertyOptional()
  type?: string;

  @ApiPropertyOptional()
  status?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  short_description?: string;

  @ApiPropertyOptional()
  seasons_count?: number;

  @ApiPropertyOptional()
  episodes_count?: number;

  @ApiPropertyOptional()
  likes_count?: number;

  @ApiPropertyOptional()
  dislikes_count?: number;

  @ApiPropertyOptional()
  watches_count?: number;
}

class EpisodeBriefDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  episode_number?: number;

  @ApiPropertyOptional()
  season_number?: number;

  @ApiPropertyOptional()
  poster_url?: string;

  @ApiPropertyOptional()
  rating?: number;

  @ApiPropertyOptional()
  likes_count?: number;

  @ApiPropertyOptional()
  dislikes_count?: number;

  @ApiPropertyOptional()
  watches_count?: number;
}

export class UserMovieListItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ enum: UserMovieType })
  type!: UserMovieType;

  @ApiProperty()
  progress_time!: number | null;

  @ApiProperty({ enum: CommentEntityType })
  entity_type!: CommentEntityType;

  @ApiPropertyOptional({ type: MovieBriefDto })
  movie?: MovieBriefDto;

  @ApiPropertyOptional({ type: EpisodeBriefDto })
  episode?: EpisodeBriefDto;
}

export class PaginatedUserMoviesDto extends PaginationMetaDto {
  @ApiProperty({ type: [UserMovieListItemDto] })
  data!: UserMovieListItemDto[];
}

export class UserMovieActionsDto {
  @ApiProperty({ type: [String] })
  actions!: string[];
}
