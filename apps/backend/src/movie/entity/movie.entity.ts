import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  AppLanguage,
  MovieFileType,
  MovieType,
  SortType,
  RoleType,
  SortByType,
} from '../../common/enums';
import { defaultLang } from '../../lib/utils';

@ObjectType()
export class Movie {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => MovieType)
  type: MovieType;

  @Field(() => Int, { nullable: true })
  seasons_count?: number;

  @Field(() => Int, { nullable: true })
  age_limit?: number;

  @Field(() => String)
  slug: string;

  @Field(() => Int)
  likes_percent: number;

  @Field(() => Int)
  likes_counts: number;

  @Field(() => Int)
  watches_counts: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  short_description: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  movie_language: string;

  @Field(() => [MovieFactor])
  factors: MovieFactor[];

  @Field(() => [MovieGenre])
  genres: MovieGenre[];

  @Field(() => [MovieCountry])
  countries: MovieCountry[];

  @Field(() => [MovieLanguage])
  languages: MovieLanguage[];

  @Field(() => [MovieFile])
  files: MovieFile[];
}

@ObjectType()
export class MovieFactorRole {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => String)
  slug: string;

  @Field(() => RoleType)
  type: RoleType;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class MovieFactorRoleTranslation {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  role_id: number;

  @Field(() => AppLanguage)
  language: AppLanguage;
}

@ObjectType()
export class MovieFactor {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  @Field(() => MovieFactorRole)
  role: MovieFactorRole;
}

@ObjectType()
export class MovieGenre {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class MovieLanguage {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  label: string;
}

@ObjectType()
export class MovieCountry {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  label: string;
}

@ObjectType()
export class MovieFile {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;

  @Field(() => String)
  path: string;

  @Field(() => String)
  mime_type: string;

  @Field(() => String, { nullable: true })
  file_name?: string;

  @Field(() => String)
  source_type: string;

  @Field(() => String, { nullable: true })
  alt_text?: string;

  @Field(() => String, { nullable: true })
  size?: string;

  @Field(() => String, { nullable: true })
  width?: string;

  @Field(() => String, { nullable: true })
  height?: string;

  @Field(() => String, { nullable: true })
  duration?: string;

  @Field(() => MovieFileType)
  type: MovieFileType;
}

//////////////////////////////////

@InputType()
export class MovieFilterInput {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => AppLanguage, { defaultValue: defaultLang })
  lang: AppLanguage;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  page_size?: number;

  @Field(() => [Int], { nullable: true })
  genres?: number[];

  @Field(() => [Int], { nullable: true })
  age_limits?: number[];

  @Field(() => [String], { nullable: true })
  countries?: string[];

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => [String], { nullable: true })
  languages?: string[];

  @Field(() => SortByType, { nullable: true })
  sort_by?: SortByType;

  @Field(() => SortType, { nullable: true })
  sort_order?: SortType;

  @Field(() => MovieType, { nullable: true })
  type?: MovieType;

  @Field(() => Int, { nullable: true })
  released_year_from?: number;

  @Field(() => Int, { nullable: true })
  released_year_to?: number;

  @Field(() => String, { nullable: true })
  section?: string;
}
