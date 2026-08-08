import i18n from '@/i18n'
import { languageDirectionMap } from '@/utilities/config/direction'
import { fonts, languageFontMap } from '@/utilities/config/fonts'
import { Api } from '@/scripts'
import { AppApis } from '../../data'
import { AppLanguagesEnum, type Direction } from '../../types'
import type {
  AsyncSelectApi,
} from '@/utilities/components'
import type { CountriesApiResponseType } from '../countries/countries.type'
import type { FactorsApiResponseType } from '../factors/factors.type'
import type { GenresApiResponseType } from '../genres/genres.type'
import type { LanguagesApiResponseType } from '../languages/languages.type'
import type { RolesApiResponseType } from '../roles/roles.type'
import type { TagsApiResponseType } from '../tags/tags.type'
import type { MoviesApiResponseType } from './movies.type'

const intlLocales: Record<string, string> = {
  FA: 'fa-IR-u-ca-persian',
  EN: 'en-US',
  AR: 'ar-EG',
}

export function formatMovieCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const movieTabLanguageOrder: AppLanguagesEnum[] = [
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

type SelectPage<T> = { data: T[]; page: number; page_size: number; count: number }

const makeApi = <T>(
  url: string
): AsyncSelectApi<T> => (params) =>
  Api<SelectPage<T>>(url, {
    method: 'GET',
    query: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search || undefined,
      sort: 'ASC',
    },
  })

export const genresSelectApi = makeApi<GenresApiResponseType['data'][number]>(
  AppApis.genre.all
)
export const moviesSelectApi = makeApi<MoviesApiResponseType['data'][number]>(
  AppApis.movie.all
)
export const tagsSelectApi = makeApi<TagsApiResponseType['data'][number]>(
  AppApis.tag.all
)
export const countriesSelectApi =
  makeApi<CountriesApiResponseType['data'][number]>(AppApis.country.all)
export const languagesSelectApi =
  makeApi<LanguagesApiResponseType['data'][number]>(AppApis.language.all)
export const factorsSelectApi =
  makeApi<FactorsApiResponseType['data'][number]>(AppApis.factor.all)
export const rolesSelectApi = makeApi<RolesApiResponseType['data'][number]>(
  AppApis.role.all
)

export function factorSelectLabel(
  factor: FactorsApiResponseType['data'][number]
): string {
  return `${factor.first_name} ${factor.last_name}`.trim()
}

export function movieGenreLabel(
  genres: { id: number; translations?: { name: string; language: string }[]; name?: string }[],
  genreId: number
): string {
  const genre = genres.find((item) => item.id === genreId)
  if (!genre) return String(genreId)
  if (genre.name) return genre.name
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  const translation =
    genre.translations?.find((item) => item.language === lang) ??
    genre.translations?.[0]
  return translation?.name ?? String(genreId)
}

export function movieTagLabel(
  tags: {
    id: number
    translations?: { label: string; language: string }[]
    label?: string
  }[],
  tagId: number
): string {
  const tag = tags.find((item) => item.id === tagId)
  if (!tag) return String(tagId)
  if (tag.label) return tag.label
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  const translation =
    tag.translations?.find((item) => item.language === lang) ??
    tag.translations?.[0]
  return translation?.label ?? String(tagId)
}

export function movieFactorLabel(
  factors: {
    id: number
    first_name?: string
    last_name?: string
    translations?: { first_name: string; last_name: string; language: string }[]
  }[],
  factorId: number
): string {
  const factor = factors.find((item) => item.id === factorId)
  if (!factor) return String(factorId)
  if (factor.first_name || factor.last_name) {
    return `${factor.first_name ?? ''} ${factor.last_name ?? ''}`.trim()
  }
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  const translation =
    factor.translations?.find((item) => item.language === lang) ??
    factor.translations?.[0]
  if (!translation) return String(factorId)
  return `${translation.first_name} ${translation.last_name}`.trim()
}