import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { fonts, languageFontMap } from '@/utilities/config/fonts'
import { GetCookie, SetCookie, RemoveCookie } from '@/scripts'

type Font = (typeof fonts)[number]

const FONT_COOKIE_NAME = 'font'
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type FontContextType = {
  font: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType | null>(null)

function getLanguageDefaultFont(language: string): Font {
  return languageFontMap[language] || fonts[0]
}

export function __FontProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage || 'EN'

  const [font, _setFont] = useState<Font>(() => {
    const savedFont = GetCookie(FONT_COOKIE_NAME)
    if (savedFont && fonts.includes(savedFont as Font)) {
      return savedFont as Font
    }
    return getLanguageDefaultFont(currentLanguage)
  })

  useEffect(() => {
    const applyFont = (font: string) => {
      const root = document.documentElement
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls)
      })
      root.classList.add(`font-${font}`)
    }

    applyFont(font)
  }, [font])

  const onLanguageChanged = useCallback((lng: string) => {
    const defaultFont = getLanguageDefaultFont(lng)
    const savedFont = GetCookie(FONT_COOKIE_NAME)
    if (!savedFont || !fonts.includes(savedFont as Font)) {
      _setFont(defaultFont)
    }
  }, [])

  useEffect(() => {
    i18n.on('languageChanged', onLanguageChanged)
    return () => {
      i18n.off('languageChanged', onLanguageChanged)
    }
  }, [i18n, onLanguageChanged])

  const setFont = (font: Font) => {
    SetCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE)
    _setFont(font)
  }

  const resetFont = () => {
    RemoveCookie(FONT_COOKIE_NAME)
    const defaultFont = getLanguageDefaultFont(currentLanguage)
    _setFont(defaultFont)
  }

  return (
    <FontContext value={{ font, setFont, resetFont }}>{children}</FontContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const __useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}
