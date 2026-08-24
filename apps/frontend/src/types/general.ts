import { AppLanguagesEnum } from ".";

//      ----------------------- types -----------------------
export type __PaginationType<T> = {
  page: number;
  page_size: number;
  count: number;
  data: T;
};

export type __JWTTokenType = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
};

export type __MessageType = {
  message: string;
};

export type __CardsDataType = {
  total_views: number;
  view_growth_rate: number;
  total_users: number;
  users_growth_rate: number;
  total_content: number;
  total_series: number;
  total_cinematic: number;
  movies_growth_rate: number;
  total_watch_times: number;
  watch_progress_growth: number;
};

export type __MonthlyWatchDataType = {
  month: number;
  total: number;
};

export type __RecentUserType = {
  id: number;
  created_at: string;
  block_expires_at?: string | null;
  email: string;
  username: string;
  role: string;
};

export type __OverviewStatsType = {
  cards_data: __CardsDataType;
  current_year_watch_data: __MonthlyWatchDataType[];
  recent_users: __RecentUserType[];
};

export type __AnalyticsCardsDataType = {
  total_plays: number;
  total_plays_growth: number;
  unique_viewers: number;
  unique_viewers_growth: number;
  completion_rate: number;
  completion_rate_growth: number;
  avg_watch_time: number;
  avg_watch_time_growth: number;
};

export type __WeeklyChartDataType = {
  day: number;
  total_plays: number;
  unique_viewers: number;
};

export type __TopMovieType = {
  id: number;
  title: string;
  plays_count: number;
};

export type __TopGenreType = {
  id: number;
  name: string;
  plays_count: number;
};

export type __AnalyticsStatsType = {
  cards_data: __AnalyticsCardsDataType;
  current_week_chart_data: __WeeklyChartDataType[];
  top_movies: __TopMovieType[];
  top_genres: __TopGenreType[];
};

export type __SummaryStatsType = {
  comments: number;
  contacts: number;
};

export type __CommentUserType = {
  id: number;
  username: string;
  email: string;
};

export type __CommentType = {
  id: number;
  created_at: string;
  updated_at: string;
  likes_count: number;
  dislikes_count: number;
  status: string;
  entity_type: string;
  movie_id: number;
  episode_id?: number;
  body: string;
  user_id: number;
  user: __CommentUserType;
};

export type __AllCommentsType = __CommentType & {
  movie_title: string;
  season_title?: string;
  episode_title?: string;
};

export type __EntityCommentType = __CommentType & {
  did_user_liked: boolean;
  did_user_disliked: boolean;
};

export type __ContactType = {
  id: number;
  created_at: string;
  updated_at: string;
  user_email: string;
  message: string;
  is_registered: boolean;
  status: string;
  answer_message?: string;
  rejected_detail?: string;
};

export type __CountryTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  country_id: number;
  label: string;
  language: string;
};

export type __CountryType = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  translations: __CountryTranslationType[];
};

export type __CountryListType = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  label: string;
};

export type __CreateCountryType = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
};

export type __EpisodeFileType = {
  id: number;
  created_at: string;
  updated_at: string;
  path: string;
  mime_type: string;
  file_name?: string;
  source_type: string;
  alt_text?: string;
  size?: number;
  width?: string;
  height?: string;
  duration?: string;
  type: string;
  intro_start_time?: number;
  intro_duration?: number;
  outro_duration?: number;
};

export type __EpisodeTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  short_description: string;
  episode_id: number;
  language: string;
};

export type __EpisodeDetailAdminType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  season_id: number;
  movie_id: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  files?: __EpisodeFileType[];
  translations?: __EpisodeTranslationType[];
};

export type __EpisodeDetailSeasonType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  movie_id: number;
  title: string;
};

export type __EpisodeDetailNextEpisodeType = {
  id: number;
  order: number;
  slug: string;
  season_id: number;
  movie_id: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  title: string;
  season_title: string;
};

export type __MovieDetailPublicType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  slug: string;
  age_limit?: number;
  released_year: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  combined_tags: string;
  title: string;
  short_description: string;
  description: string;
  seasons_count?: number;
  episodes_count?: number;
  factors?: __MovieFactorType[];
  genres?: __MovieGenreType[];
  countries?: __MovieCountryType[];
  languages?: __MovieLanguageType[];
  files: __MovieFileType[];
  seasons?: __MovieSeasonType[];
};

export type __EpisodeDetailPublicType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  season_id: number;
  movie_id: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  title: string;
  short_description: string;
  files: __EpisodeFileType[];
  movie: __MovieDetailPublicType;
  season: __EpisodeDetailSeasonType;
  next_episode?: __EpisodeDetailNextEpisodeType;
};

export type __EpisodeListItemType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  season_id: number;
  movie_id: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  title: string;
  movie_title: string;
  season_title: string;
  movie_season_count: number;
  files: __EpisodeFileType[];
};

export type __FactorTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  factor_id: number;
  language: string;
};

export type __FactorUploadType = {
  id: number;
  created_at: string;
  updated_at: string;
  path: string;
  mime_type: string;
  file_name?: string;
  source_type: string;
  alt_text?: string;
  size?: number;
  width?: string;
  height?: string;
  duration?: string;
};

export type __FactorFileTypeDef = {
  id: number;
  path: string;
  mime_type: string;
  file_name?: string;
  type: string;
};

export type __FactorProfileType = {
  id: number;
  factor_id: number;
  upload_id: number;
  type: string;
  path: string;
};

export type __FactorType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  translations: __FactorTranslationType[];
  profile?: __FactorUploadType;
};

export type __FactorDetailType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  first_name: string;
  last_name: string;
  profile?: __FactorUploadType;
  translations: __FactorTranslationType[];
};

export type __FactorListType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  first_name: string;
  last_name: string;
  profile?: __FactorProfileType;
};

export type __FactorMovieListItemType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  slug: string;
  age_limit?: number;
  released_year: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  combined_tags: string;
  title: string;
  files: __MovieFileType[];
};

export type __GenreTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  genre_id: number;
  name: string;
  language: string;
};

export type __GenreType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  translations: __GenreTranslationType[];
};

export type __GenreListType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  name: string;
};

export type __HeaderMenuTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  language: string;
  menu_id: number;
};

export type __HeaderMenuFilterType = {
  id: number;
  created_at: string;
  updated_at: string;
  filter_key: string;
  filter_value: string;
  menu_id: number;
};

export type __HeaderMenuDetailType = {
  id: number;
  created_at: string;
  updated_at: string;
  menu_type: string;
  href?: string;
  order: number;
  parent_id?: number;
  parent?: __HeaderMenuDetailType;
  translations: __HeaderMenuTranslationType[];
  filters?: __HeaderMenuFilterType[];
};

export type __HeaderMenuPublicType = {
  id: number;
  created_at: string;
  updated_at: string;
  menu_type: string;
  href?: string;
  order: number;
  parent_id?: number;
  children?: __HeaderMenuPublicType[];
  title: string;
  filter?: string;
};

export type __HeaderMenuListType = {
  id: number;
  created_at: string;
  updated_at: string;
  menu_type: string;
  href?: string;
  order: number;
  parent_id?: number;
  title: string;
  filters?: __HeaderMenuFilterType[];
};

export type __LanguageTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  label: string;
  lang: string;
};

export type __LanguageType = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  translations: __LanguageTranslationType[];
};

export type __LanguageListType = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  label: string;
};

export type __MovieFileType = {
  id: number;
  created_at: string;
  updated_at: string;
  path: string;
  mime_type: string;
  file_name?: string;
  source_type: string;
  alt_text?: string;
  size?: number;
  width?: string;
  height?: string;
  duration?: string;
  type: string;
  intro_start_time?: number;
  intro_duration?: number;
  outro_duration?: number;
};

export type __MovieRoleType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  type: string;
  name: string;
};

export type __MovieFactorType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  first_name: string;
  last_name: string;
  role_name?: string;
  role: __MovieRoleType;
};

export type __MovieGenreType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  name: string;
};

export type __MovieCountryType = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  label: string;
};

export type __MovieLanguageType = {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  label: string;
};

export type __MovieSeasonType = {
  id: number;
  order: number;
  slug: string;
  movie_id: number;
  title: string;
  files: __MovieFileType[];
};

export type __MovieAdminFactorProfileType = {
  id: number;
  created_at: string;
  updated_at: string;
  path: string;
  mime_type: string;
  file_name?: string;
  source_type: string;
  alt_text?: string;
  size?: number;
  width?: string;
  height?: string;
  duration?: string;
  type: string;
};

export type __MovieAdminFactorTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  factor_id: number;
  first_name: string;
  last_name: string;
  language: string;
};

export type __MovieAdminFactorType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  first_name: string;
  last_name: string;
  type: string;
  role: __MovieRoleType;
  profile: __MovieAdminFactorProfileType;
  translations: __MovieAdminFactorTranslationType[];
};

export type __MovieAdminGenreTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  genre_id: number;
  language: string;
};

export type __MovieAdminGenreType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  translations: __MovieAdminGenreTranslationType[];
};

export type __MovieAdminSeasonType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  movie_id: number;
};

export type __MovieAdminEpisodeType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  season_id: number;
  movie_id: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
};

export type __MovieAdminTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  short_description: string;
  description: string;
  language: string;
  movie_id: number;
};

export type __MovieAdminDetailType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  slug: string;
  age_limit?: number;
  released_year: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  combined_tags: string;
  factors: __MovieAdminFactorType[];
  genres: __MovieAdminGenreType[];
  countries: __MovieCountryType[];
  languages: __MovieLanguageType[];
  tags: __TagType[];
  files: __MovieFileType[];
  seasons: __MovieAdminSeasonType[];
  episodes: __MovieAdminEpisodeType[];
  translations: __MovieAdminTranslationType[];
  seasons_count?: number;
  episodes_count?: number;
};

export type __MovieRecommendedType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  slug: string;
  age_limit?: number;
  released_year: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  combined_tags: string;
  title: string;
  short_description: string;
  description: string;
  files: __MovieFileType[];
};

export type __MovieListItemType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  slug: string;
  age_limit?: number;
  released_year: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  title: string;
  short_description: string;
  combined_tags?: string;
  seasons_count?: number;
  episodes_count?: number;
  factors?: __MovieFactorType[];
  genres?: __MovieGenreType[];
  files: __MovieFileType[];
};

export type __PushSubscriptionType = {
  id: number;
  endpoint: string;
  created_at: string;
};

export type __RoleTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  role_id: number;
  name: string;
  language: string;
};

export type __RoleType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  type: string;
  translations: __RoleTranslationType[];
};

export type __RoleListType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  type: string;
  name: string;
};

export type __SeasonFileType = {
  id: number;
  created_at: string;
  updated_at: string;
  path: string;
  mime_type: string;
  file_name?: string;
  source_type: string;
  alt_text?: string;
  size?: number;
  width?: string;
  height?: string;
  duration?: string;
  type: string;
  intro_start_time?: number;
  intro_duration?: number;
  outro_duration?: number;
};

export type __SeasonType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  movie_id: number;
  files: __SeasonFileType[];
};

export type __SeasonTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  short_description: string;
  season_id: number;
  language: string;
};

export type __SeasonDetailMovieTranslationType = {
  title: string;
  language: string;
};

export type __SeasonDetailMovieType = {
  translations: __SeasonDetailMovieTranslationType[];
};

export type __SeasonDetailType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  movie_id: number;
  translations: __SeasonTranslationType[];
  movie: __SeasonDetailMovieType;
  episodes_count: number;
  files: __SeasonFileType[];
};

export type __SeasonListType = {
  id: number;
  created_at: string;
  updated_at: string;
  order: number;
  slug: string;
  movie_id: number;
  movie_title: string;
  title: string;
  files: __SeasonFileType[];
  episodes_count: number;
};

export type __SeasonEpisodeFileType = {
  id: number;
  created_at: string;
  updated_at: string;
  path: string;
  mime_type: string;
  file_name?: string;
  source_type: string;
  alt_text?: string;
  size?: number;
  width?: string;
  height?: string;
  duration?: string;
  type: string;
};

export type __SeasonEpisodeListItemType = __EpisodeListItemType & {
  files: __SeasonEpisodeFileType[];
  watch_progress_time: number;
};

export type __SectionFilterType = {
  id: number;
  filter_key: string;
  filter_value: string;
};

export type __SectionTranslationType = {
  id: number;
  title: string;
  description?: string;
  language: string;
};

export type __SectionType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  order: number;
  view_mode: string;
  selection_mode: string;
  sort_mode?: string;
  period_base?: string;
  translations: __SectionTranslationType[];
  section_filters: __SectionFilterType[];
  movies: __MovieListItemType[];
};

export type __SectionDetailType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  order: number;
  view_mode: string;
  selection_mode: string;
  sort_mode?: string;
  period_base?: string;
  translations: __SectionTranslationType[];
  section_filters: __SectionFilterType[];
  section_movies: __MovieListItemType[];
};

export type __SectionMovieListItemType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  slug: string;
  age_limit?: number;
  released_year: number;
  likes_count: number;
  dislikes_count: number;
  watches_count: number;
  title: string;
  short_description: string;
  seasons_count?: number;
  episodes_count?: number;
  files: __MovieFileType[];
};

export type __SectionListItemType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  order: number;
  view_mode: string;
  selection_mode: string;
  sort_mode?: string;
  period_base?: string;
  title: string;
  description?: string;
  filter?: string;
  section_filters: __SectionFilterType[];
  movies: __SectionMovieListItemType[];
};

export type __TagTranslationType = {
  id: number;
  created_at: string;
  updated_at: string;
  tag_id: number;
  label: string;
  language: string;
};

export type __TagType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  translations: __TagTranslationType[];
};

export type __TagListType = {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  label: string;
};

export type __UploadType = {
  id: number;
  path: string;
  mime_type: string;
  file_name?: string;
  source_type: string;
  alt_text?: string;
  size?: number;
  width?: string;
  height?: string;
  duration?: string;
};

export type __UserType = {
  id: number;
  created_at: string;
  updated_at: string;
  username: string;
  email: string;
  google_id: string | null;
  role: string;
  block_expires_at: string | null;
  preferred_language: AppLanguagesEnum;
};

export type __UserMovieActionType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  progress_time: number | null;
  user_id: number;
  movie_id: number | null;
  episode_id: number | null;
  entity_type: string;
};

export type __MovieBriefType = {
  id: number;
  title: string;
  poster_url?: string;
  rating?: number;
  release_date?: string;
  type?: string;
  status?: string;
  description?: string;
  short_description?: string;
  seasons_count?: number;
  episodes_count?: number;
  likes_count?: number;
  dislikes_count?: number;
  watches_count?: number;
  files: __MovieFileType[];
};

export type __EpisodeBriefType = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  order: number;
  slug: string;
  season_id?: number;
  movie_id: number;
  likes_count?: number;
  dislikes_count?: number;
  watches_count?: number;
  files: __MovieFileType[];
};

export type __UserMovieListItemType = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  progress_time: number | null;
  entity_type: string;
  movie?: __MovieBriefType;
  episode?: __EpisodeBriefType;
};

export type __UserMovieActionsType = {
  actions: string[];
};

export type __ApiErrorItemType = {
  status: number;
  detail: string;
};

export type __ApiErrorType = {
  status: number;
  error: {
    success: boolean;
    errors: __ApiErrorItemType[];
  };
};

export type __MediaFileType = "image" | "video";

export const __MediaFileAcceptMap: Record<__MediaFileType, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  video: "video/mp4,video/webm,video/quicktime",
};

export type __NotificationType = {
  comments: number;
  contacts: number;
};

export type __StatsOverviewType = {
  cards_data: {
    total_views: number;
    view_growth_rate: number;
    total_users: number;
    users_growth_rate: number;
    total_content: number;
    total_series: number;
    total_cinematic: number;
    movies_growth_rate: number;
    total_watch_times: number;
    watch_progress_growth: number;
  };
  current_year_watch_data: {
    month: number;
    total: number;
  }[];

  recent_users: __UserType[];
};

export type __StatsAnalyticsType = {
  cards_data: {
    total_plays: number;
    total_plays_growth: number;
    unique_viewers: number;
    unique_viewers_growth: number;
    completion_rate: number;
    completion_rate_growth: number;
    avg_watch_time: number;
    avg_watch_time_growth: number;
  };
  current_week_chart_data: {
    day: number;
    total_plays: number;
    unique_viewers: number;
  }[];
  top_movies: {
    id: number;
    title: string;
    plays_count: number;
  }[];
  top_genres: {
    id: number;
    name: string;
    plays_count: number;
  }[];
};

export type __ApiQueryType = {
  search?: string;
  page?: number;
  page_size?: number;
  lang?: __AppLanguagesEnum;
  sort?: __SortTypeEnum;
};

export type __ApiCallOptionsType = {
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  query?: Record<string, unknown> | __ApiQueryType;
  locale?: AppLanguagesEnum;
  ghostMode?: boolean;
};

export type __CookieOptionsType = {
  maxAge?: number;
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
};

export type __MenuItemType = {
  id: number;
  created_at: string;
  updated_at: string;
  menu_type: __MenuTypeEnum;
  href: string | null;
  order: number;
  parent_id: number | null;
  title: string;
  filter: string | null;
  children: __MenuItemType[];
};

export type __AuthModeType = __AuthModeEnum | null;

export type __ConfirmModalValueType = {
  title: string;
  description: string;
  showHeader?: boolean;
  submitText?: string;
  cancelText?: string;
  callback?: () => void | Promise<unknown>;
};

//      ----------------------- enums -----------------------

export enum __AppLanguagesEnum {
  FA = "FA",
  EN = "EN",
  AR = "AR",
}

export enum __UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum __SortTypeEnum {
  ASC = "ASC",
  DESC = "DESC",
}

export enum __MenuTypeEnum {
  PAGE = "PAGE",
  FILTER = "FILTER",
}

export enum __AuthModeEnum {
  LOGIN = "Login",
  SIGNUP = "Signup",
  FORGET_PASSWORD = "ForgetPassword",
}
