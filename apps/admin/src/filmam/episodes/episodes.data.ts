import i18n from '@/i18n'
import { languageDirectionMap } from '@/utilities/config/direction'
import { fonts, languageFontMap } from '@/utilities/config/fonts'
import { Api } from '@/scripts'
import { AppApis } from '../../data'
import { AppLanguagesEnum, type Direction } from '../../types'
import type { AsyncSelectApi } from '@/utilities/components'
import type { MoviesApiResponseType } from '../movies/movies.type'
import type { SeasonsApiResponseType } from '../seasons/seasons.type'
import type { EpisodesApiResponseType } from './episodes.type'

const intlLocales: Record<string, string> = {
  FA: 'fa-IR-u-ca-persian',
  EN: 'en-US',
  AR: 'ar-EG',
}

export function formatEpisodeCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const episodeTabLanguageOrder: AppLanguagesEnum[] = [
  AppLanguagesEnum.EN,
  AppLanguagesEnum.FA,
  AppLanguagesEnum.AR,
]

export function getLanguageFontClass(lang: string) {
  return `font-${languageFontMap[lang] ?? fonts[0]}`
}

export function getLanguageDirection(lang: string): Direction {
  return languageDirectionMap[lang] ?? 'ltr'
}

type SelectPage<T> = {
  data: T[]
  page: number
  page_size: number
  count: number
}

const makeApi = <T>(
  url: string,
  extraQuery?: Record<string, string | number | undefined>
): AsyncSelectApi<T> => (params) =>
  Api<SelectPage<T>>(url, {
    method: 'GET',
    query: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search || undefined,
      sort: 'ASC',
      ...extraQuery,
    },
  })

export const moviesSeriesSelectApi = makeApi<MoviesApiResponseType['data'][number]>(
  AppApis.movie.all,
  { type: 'SERIES' }
)
export const seasonsSelectApi =
  makeApi<SeasonsApiResponseType['data'][number]>(AppApis.season.adminAll)
export const movieSeasonsSelectApi = (movieId: number) =>
  makeApi<SeasonsApiResponseType['data'][number]>(AppApis.season.adminAll, {
    movie_id: movieId,
  })
export const episodesSelectApi =
  makeApi<EpisodesApiResponseType['data'][number]>(AppApis.episode.adminAll)
