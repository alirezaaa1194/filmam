import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MovieType,
  MovieFileType,
  SourceType,
  RoleType,
  FactorFileType,
  AppLanguage,
} from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';
import { TagResponseDto } from '../../tag/dto/tag.response.dto';

export class MovieFileResponseDto {
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
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

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
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

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
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;
}

export class MovieCountryResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  label!: string;
}

export class MovieLanguageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

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
  movie_id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
}

export class MovieAdminFactorProfileDto {
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

  @ApiProperty({ enum: FactorFileType })
  type!: FactorFileType;
}

export class MovieAdminFactorTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  factor_id!: number;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class MovieAdminFactorDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ enum: RoleType })
  type!: RoleType;

  @ApiProperty({ type: MovieAdminFactorProfileDto })
  profile!: MovieAdminFactorProfileDto;

  @ApiProperty({ type: [MovieAdminFactorTranslationDto] })
  translations!: MovieAdminFactorTranslationDto[];
}

export class MovieAdminGenreTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  genre_id!: number;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class MovieAdminGenreDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ type: [MovieAdminGenreTranslationDto] })
  translations!: MovieAdminGenreTranslationDto[];
}

export class MovieAdminSeasonDto {
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
}

export class MovieAdminEpisodeDto {
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
}

export class MovieAdminTranslationDto {
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
  description!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;

  @ApiProperty()
  movie_id!: number;
}

export class MovieAdminDetailResponseDto {
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

  @ApiProperty({ type: [MovieAdminFactorDto] })
  factors!: MovieAdminFactorDto[];

  @ApiProperty({ type: [MovieAdminGenreDto] })
  genres!: MovieAdminGenreDto[];

  @ApiProperty({ type: [TagResponseDto] })
  tags!: TagResponseDto[];

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];

  @ApiProperty({ type: [MovieAdminSeasonDto] })
  seasons!: MovieAdminSeasonDto[];

  @ApiProperty({ type: [MovieAdminEpisodeDto] })
  episodes!: MovieAdminEpisodeDto[];

  @ApiProperty({ type: [MovieAdminTranslationDto] })
  translations!: MovieAdminTranslationDto[];

  @ApiPropertyOptional()
  seasons_count?: number;

  @ApiPropertyOptional()
  episodes_count?: number;
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

  @ApiPropertyOptional({ type: [MovieFactorResponseDto] })
  factors?: MovieFactorResponseDto[];

  @ApiPropertyOptional({ type: [MovieGenreResponseDto] })
  genres?: MovieGenreResponseDto[];

  @ApiPropertyOptional({ type: [MovieCountryResponseDto] })
  countries?: MovieCountryResponseDto[];

  @ApiPropertyOptional({ type: [MovieLanguageResponseDto] })
  languages?: MovieLanguageResponseDto[];

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];

  @ApiPropertyOptional({ type: [MovieSeasonResponseDto] })
  seasons?: MovieSeasonResponseDto[];
}

export class MovieRecommendedResponseDto {
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

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
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

  @ApiPropertyOptional({ type: [MovieFactorResponseDto] })
  factors?: MovieFactorResponseDto[];

  @ApiPropertyOptional({ type: [MovieGenreResponseDto] })
  genres?: MovieGenreResponseDto[];

  @ApiProperty({ type: [MovieFileResponseDto] })
  files!: MovieFileResponseDto[];
}

export class PaginatedMoviesDto extends PaginationMetaDto {
  @ApiProperty({ type: [MovieListItemDto] })
  data!: MovieListItemDto[];
}
