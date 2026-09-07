import {
  AppLanguage,
  MovieFileType,
  MovieType,
  SortType,
  RoleType,
  SortByType,
} from '../../common/enums';

export type Movie = {
  id: number;
  created_at: string;
  updated_at: string;
  type: MovieType;
  seasons_count?: number | null;
  age_limit?: number | null;
  slug: string;
  likes_percent: number;
  likes_counts: number;
  watches_counts: number;
  title: string;
  short_description: string;
  description: string;
  country: string;
  movie_language: string;
  factors: MovieFactor[];
  genres: MovieGenre[];
  countries: MovieCountry[];
  languages: MovieLanguage[];
  files: MovieFile[];
};

export type MovieFactorRole = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  type: RoleType;
  name: string;
};

export type MovieFactorRoleTranslation = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  role_id: number;
  language: AppLanguage;
};

export type MovieFactor = {
  id: number;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  role: MovieFactorRole;
};

export type MovieGenre = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  name: string;
};

export type MovieLanguage = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  label: string;
};

export type MovieCountry = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  label: string;
};

export type MovieFile = {
  id: number;
  created_at: string;
  updated_at: string;
  path: string;
  mime_type: string;
  file_name?: string | null;
  source_type: string;
  alt_text?: string | null;
  size?: string | null;
  width?: string | null;
  height?: string | null;
  duration?: string | null;
  type: MovieFileType;
};

export type MovieFilterInput = {
  search?: string | null;
  lang: AppLanguage;
  page?: number | null;
  page_size?: number | null;
  genres?: number[] | null;
  age_limits?: number[] | null;
  countries?: string[] | null;
  tags?: string[] | null;
  languages?: string[] | null;
  sort_by?: SortByType | null;
  sort_order?: SortType | null;
  type?: MovieType | null;
  released_year_from?: number | null;
  released_year_to?: number | null;
  section?: string | null;
};
