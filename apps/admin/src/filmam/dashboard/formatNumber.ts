const IntlLocales: Record<string, string> = {
  FA: 'fa-IR',
  EN: 'en-US',
  AR: 'ar-EG',
}

export function formatNumber(value: number, lang?: string) {
  const locale = IntlLocales[lang?.toUpperCase() ?? 'EN'] ?? 'en-US'
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
    value
  )
}
