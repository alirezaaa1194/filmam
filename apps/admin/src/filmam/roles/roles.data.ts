import i18n from '@/i18n'
import { languageDirectionMap } from '@/utilities/config/direction'
import { fonts, languageFontMap } from '@/utilities/config/fonts'
import { AppLanguagesEnum, type Direction } from '../../types'
import type { RoleTypeValue } from './roles.type'

const intlLocales: Record<string, string> = {
  EN: 'en-US',
  FA: 'fa-IR-u-ca-persian',
  AR: 'ar-EG',
}

export function formatRoleCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const roleTabLanguageOrder: AppLanguagesEnum[] = [
  AppLanguagesEnum.EN,
  AppLanguagesEnum.FA,
  AppLanguagesEnum.AR,
]

export const roleTypes = [
  { labelKey: 'roles.type_creator', value: 'CREATOR' },
  { labelKey: 'roles.type_actor', value: 'ACTOR' },
  { labelKey: 'roles.type_director', value: 'DIRECTOR' },
  { labelKey: 'roles.type_presenter', value: 'PRESENTER' },
] satisfies ReadonlyArray<{ labelKey: string; value: RoleTypeValue }>

export const callTypes = new Map<string, string>([
  [
    'CREATOR',
    'bg-violet-100/60 text-violet-900 border-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500',
  ],
  [
    'ACTOR',
    'bg-rose-100/60 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-500',
  ],
  [
    'DIRECTOR',
    'bg-amber-100/60 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500',
  ],
  [
    'PRESENTER',
    'bg-sky-100/60 text-sky-900 border-sky-300 dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-500',
  ],
])

export function getLanguageFontClass(lang: string) {
  return `font-${languageFontMap[lang] ?? fonts[0]}`
}

export function getLanguageDirection(lang: string): Direction {
  return languageDirectionMap[lang] ?? 'ltr'
}
