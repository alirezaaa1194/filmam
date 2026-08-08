import { z } from 'zod'
import type { AppLanguagesEnum } from '../../types'

export const genreSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Genre = z.infer<typeof genreSchema>

export type GenreTranslationType = {
  id: number
  created_at: string
  updated_at: string
  genre_id: number
  name: string
  language: AppLanguagesEnum
}

export type GenreDetailType = {
  id: number
  created_at: string
  updated_at: string
  slug: string
  translations: GenreTranslationType[]
}

export type GenresApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Genre[]
}

export type CreateGenrePayloadType = {
  slug: string
  translations: {
    name: string
    lang: AppLanguagesEnum
  }[]
}
