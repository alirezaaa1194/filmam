import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import fa from './locales/fa.json'
import ar from './locales/ar.json'
import { appLanguages } from '../lib/utils'

const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
  ar: {
    translation: ar,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: appLanguages.map((l) => l.toLowerCase()),
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
