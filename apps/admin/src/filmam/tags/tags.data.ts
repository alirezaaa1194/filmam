import i18n from '@/i18n'
import { languageDirectionMap } from '@/utilities/config/direction'
import { fonts, languageFontMap } from '@/utilities/config/fonts'
import { AppLanguagesEnum, type Direction } from '../../types'

const intlLocales: Record<string, string> = {
  FA: 'fa-IR-u-ca-persian',
  EN: 'en-US',
  AR: 'ar-EG',
}

export function formatTagCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const tagsTabLanguageOrder: AppLanguagesEnum[] = [
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
