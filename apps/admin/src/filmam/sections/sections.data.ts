import i18n from '@/i18n'
import { languageDirectionMap } from '@/utilities/config/direction'
import { fonts, languageFontMap } from '@/utilities/config/fonts'
import { type Direction } from '../../types'

const intlLocales: Record<string, string> = {
  FA: 'fa-IR-u-ca-persian',
  EN: 'en-US',
  AR: 'ar-EG',
}

export function formatSectionCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const sectionTabLanguageOrder: string[] = ['EN', 'FA', 'AR']

export function getLanguageFontClass(lang: string) {
  return `font-${languageFontMap[lang] ?? fonts[0]}`
}

export function getLanguageDirection(lang: string): Direction {
  return languageDirectionMap[lang] ?? 'ltr'
}

export const sectionViewModeBadge = new Map<string, string>([
  [
    'HERO',
    'bg-amber-100/60 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500',
  ],
  [
    'NORMAL_SLIDER',
    'bg-sky-100/60 text-sky-900 border-sky-300 dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-500',
  ],
  [
    'KIDS_SLIDER',
    'bg-pink-100/60 text-pink-900 border-pink-300 dark:bg-pink-500/20 dark:text-pink-200 dark:border-pink-500',
  ],
  [
    'HERO_LIKE_SLIDER',
    'bg-violet-100/60 text-violet-900 border-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500',
  ],
  [
    'PUZZLE',
    'bg-emerald-100/60 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500',
  ],
  [
    'ADVERTISEMENT',
    'bg-orange-100/60 text-orange-900 border-orange-300 dark:bg-orange-500/20 dark:text-orange-200 dark:border-orange-500',
  ],
])

export const sectionSelectionModeBadge = new Map<string, string>([
  [
    'AUTO',
    'bg-sky-100/60 text-sky-900 border-sky-300 dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-500',
  ],
  [
    'USER_MOVIE',
    'bg-violet-100/60 text-violet-900 border-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500',
  ],
  [
    'SUGGESTION',
    'bg-emerald-100/60 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500',
  ],
  [
    'MANUAL',
    'bg-neutral-200/60 text-neutral-800 border-neutral-300 dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-neutral-600',
  ],
])
