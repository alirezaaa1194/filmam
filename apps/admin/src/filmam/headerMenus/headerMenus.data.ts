import i18n from '@/i18n'
import { languageDirectionMap } from '@/utilities/config/direction'
import { fonts, languageFontMap } from '@/utilities/config/fonts'
import { AppLanguagesEnum, type Direction } from '../../types'
import type {
  HeaderMenuTypeValue,
  SectionFilterKeyValue,
} from './headerMenus.type'

const intlLocales: Record<string, string> = {
  EN: 'en-US',
  FA: 'fa-IR-u-ca-persian',
  AR: 'ar-EG',
}

export function formatHeaderMenuCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const headerMenuTabLanguageOrder: AppLanguagesEnum[] = [
  AppLanguagesEnum.EN,
  AppLanguagesEnum.FA,
  AppLanguagesEnum.AR,
]

export const headerMenuTypes = [
  { labelKey: 'header_menus.type_page', value: 'PAGE' },
  { labelKey: 'header_menus.type_filter', value: 'FILTER' },
] satisfies ReadonlyArray<{
  labelKey: string
  value: HeaderMenuTypeValue
}>

export const headerMenuCallTypes = new Map<string, string>([
  [
    'PAGE',
    'bg-neutral-200/60 text-neutral-800 border-neutral-300 dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-neutral-600',
  ],
  [
    'FILTER',
    'bg-violet-100/60 text-violet-900 border-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500',
  ],
])

export const sectionFilterKeys = [
  { labelKey: 'header_menus.filter_keys.SEARCH', value: 'SEARCH' },
  { labelKey: 'header_menus.filter_keys.GENRES', value: 'GENRES' },
  { labelKey: 'header_menus.filter_keys.AGE_LIMITS', value: 'AGE_LIMITS' },
  { labelKey: 'header_menus.filter_keys.COUNTRIES', value: 'COUNTRIES' },
  { labelKey: 'header_menus.filter_keys.TAGS', value: 'TAGS' },
  { labelKey: 'header_menus.filter_keys.LANGUAGES', value: 'LANGUAGES' },
  { labelKey: 'header_menus.filter_keys.TYPE', value: 'TYPE' },
  {
    labelKey: 'header_menus.filter_keys.RELEASED_YEAR_FROM',
    value: 'RELEASED_YEAR_FROM',
  },
  {
    labelKey: 'header_menus.filter_keys.RELEASED_YEAR_TO',
    value: 'RELEASED_YEAR_TO',
  },
] satisfies ReadonlyArray<{ labelKey: string; value: SectionFilterKeyValue }>

export function getLanguageFontClass(lang: string) {
  return `font-${languageFontMap[lang] ?? fonts[0]}`
}

export function getLanguageDirection(lang: string): Direction {
  return languageDirectionMap[lang] ?? 'ltr'
}
