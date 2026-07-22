import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MovieType,
  MovieFileType,
  SourceType,
  RoleType,
} from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class MovieFileResponseDto {
  @ApiProperty()
  id!: number;

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

  @ApiProperty({ enum: MovieFileType })
  type!: MovieFileType;

  @ApiPropertyOptional()
  intro_start_time?: number;

  @ApiPropertyOptional()
  intro_duration?: number;

  @ApiPropertyOptional()
  outro_duration?: number;
}

export class MovieRoleResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ enum: RoleType })
  type!: RoleType;

  @ApiProperty()
  name!: string;
}

export class MovieFactorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiPropertyOptional()
  role_name?: string;

  @ApiProperty({ type: MovieRoleResponseDto })
  role!: MovieRoleResponseDto;
}

export class MovieGenreResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;
}

export class MovieCountryResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  label!: string;
}

export class MovieLanguageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  label!: string;
}

export class MovieSeasonResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
}

export class MovieDetailAdminResponseDto {
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

  @ApiProperty({ type: [MovieFactorResponseDto] })
  factors!: MovieFactorResponseDto[];

  @ApiProperty({ type: [MovieGenreResponseDto] })
  genres!: MovieGenreResponseDto[];

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
}

export class MovieDetailPublicResponseDto {
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

  @ApiProperty()
  short_description!: string;

  @ApiProperty()
  description!: string;

  @ApiPropertyOptional()
  seasons_count?: number;

  @ApiPropertyOptional()
  episodes_count?: number;

  @ApiProperty({ type: [MovieFactorResponseDto] })
  factors!: MovieFactorResponseDto[];

  @ApiProperty({ type: [MovieGenreResponseDto] })
  genres!: MovieGenreResponseDto[];

  @ApiProperty({ type: [MovieCountryResponseDto] })
  countries!: MovieCountryResponseDto[];

  @ApiProperty({ type: [MovieLanguageResponseDto] })
  languages!: MovieLanguageResponseDto[];

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];

  @ApiProperty({ type: [MovieSeasonResponseDto] })
  seasons!: MovieSeasonResponseDto[];
}

export class MovieListItemDto {
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

  @ApiProperty({ type: [MovieFactorResponseDto] })
  factors!: MovieFactorResponseDto[];

  @ApiProperty({ type: [MovieGenreResponseDto] })
  genres!: MovieGenreResponseDto[];

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
}

export class PaginatedMoviesDto extends PaginationMetaDto {
  @ApiProperty({ type: [MovieListItemDto] })
  data!: MovieListItemDto[];
}
