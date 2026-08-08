import type {
  AppLanguagesEnum,
  SeasonDetailType,
  SeasonListType,
} from '../../types'

export type Season = SeasonListType
export type SeasonDetail = SeasonDetailType
export type SeasonTranslation = SeasonDetailType['translations'][number]

export type SeasonsApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Season[]
}

export type CreateSeasonPayloadType = {
  order: number
  slug: string
  movie_id: number
  translations: {
    title: string
    short_description: string
    language: AppLanguagesEnum
  }[]
  files: {
    upload_id: number
    type: 'POSTER' | 'TRAILER'
  }[]
}
