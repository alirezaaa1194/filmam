import i18n from '@/i18n'

const intlLocales: Record<string, string> = {
  FA: 'fa-IR-u-ca-persian',
  EN: 'en-US',
  AR: 'ar-EG',
}

export function formatCommentCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const commentStatusBadge = new Map<string, string>([
  [
    'PENDING',
    'bg-amber-100/60 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500',
  ],
  [
    'APPROVED',
    'bg-emerald-100/60 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500',
  ],
  [
    'REJECTED',
    'bg-red-100/60 text-red-900 border-red-300 dark:bg-red-500/20 dark:text-red-200 dark:border-red-500',
  ],
])
