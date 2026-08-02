const IntlLocales: Record<string, string> = {
  FA: 'fa-IR-u-ca-persian',
  EN: 'en-US',
  AR: 'ar-EG',
}

function intlLocale(lang?: string) {
  return IntlLocales[lang?.toUpperCase() ?? 'EN'] ?? 'en-US'
}

function weekdayStyle(lang?: string): 'short' | 'long' {
  return lang?.toUpperCase() === 'EN' ? 'short' : 'long'
}

function monthStyle(lang?: string): 'short' | 'long' {
  return lang?.toUpperCase() === 'EN' ? 'short' : 'long'
}

export function getDayLabel(dayIndex: number, lang?: string) {
  const today = new Date()
  const diff = (today.getDay() + 1) % 7
  const weekStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - diff,
  )
  const date = new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate() + dayIndex,
  )
  return new Intl.DateTimeFormat(intlLocale(lang), {
    weekday: weekdayStyle(lang),
  }).format(date)
}

export function getMonthLabel(monthIndex: number, lang?: string) {
  const date = new Date(new Date().getFullYear(), monthIndex, 1)
  return new Intl.DateTimeFormat(intlLocale(lang), {
    month: monthStyle(lang),
  }).format(date)
}
