import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import fa from './locales/fa.json'
import ar from './locales/ar.json'
import { AppLanguages } from '../scripts'
import { AppLanguagesEnum } from '../types'

const resources = {
  EN: {
    translation: en,
  },
  FA: {
    translation: fa,
  },
  AR: {
    translation: ar,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: AppLanguages,
    fallbackLng: AppLanguagesEnum.EN,
    resources,
    detection: {
      order: ['cookie', 'navigator'],
      caches: ['cookie'],
      lookupCookie: 'i18next',
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        maxAge: 60 * 60 * 24 * 365,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
