import { z } from 'zod'
import type {
  AppLanguagesEnum,
  MovieAdminDetailType,
  MovieAdminGenreType,
  MovieFileType,
  MovieListItemType,
  UploadType,
} from '../../types'
export const movieTypes = ['CINEMATIC', 'SERIES'] as const
export type MovieTypeValue = (typeof movieTypes)[number]

export const movieUploadTypes = [
  'POSTER',
  'BANNER',
  'THUMBNAIL',
  'TRAILER',
  'FILM',
] as const
export type MovieUploadTypeValue = (typeof movieUploadTypes)[number]

export type Movie = MovieListItemType
export type MovieDetailType = MovieAdminDetailType
export type MovieDetailGenre = MovieAdminGenreType
export type MovieDetailFactor = MovieAdminDetailType['factors'][number]
export type MovieDetailFile = MovieFileType

export type MoviesApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Movie[]
}

export type CreateMoviePayloadType = {
  type: MovieTypeValue
  slug: string
  released_year: number
  age_limit?: number | null
  combined_tags: string
  genres: number[]
  tags: number[]
  countries: number[]
  languages: number[]
  factors: {
    factor_id: number
    role_id: number
    order: number
    translations: { lang: AppLanguagesEnum }[]
  }[]
  translations: {
    title: string
    short_description: string
    description: string
    language: AppLanguagesEnum
  }[]
  files: {
    upload_id: number
    upload_type: MovieUploadTypeValue
    intro_start_time?: number
    intro_duration?: number
    outro_duration?: number
  }[]
}

export const deleteMoviesSchema = z.object({
  movie_ids: z.array(z.number()),
})
export type DeleteMoviesPayloadType = z.infer<typeof deleteMoviesSchema>

export type MovieFilesState = {
  poster: UploadType[]
  thumbnail: UploadType[]
  banner: UploadType[]
  trailer: UploadType[]
  film: UploadType[]
  introStartTime: string
  introDuration: string
  outroDuration: string
}

export const emptyMovieFilesState: MovieFilesState = {
  poster: [],
  thumbnail: [],
  banner: [],
  trailer: [],
  film: [],
  introStartTime: '',
  introDuration: '',
  outroDuration: '',
}