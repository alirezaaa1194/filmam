export const fonts = ['inter', 'vazirmatn', 'ibm-plex-sans-arabic', 'system'] as const

export const languageFontMap: Record<string, (typeof fonts)[number]> = {
  EN: 'inter',
  FA: 'vazirmatn',
  AR: 'ibm-plex-sans-arabic',
}
