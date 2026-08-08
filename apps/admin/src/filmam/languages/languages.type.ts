import { z } from 'zod'
import type { AppLanguagesEnum } from '../../types'

export const languageSchema = z.object({
  id: z.number(),
  code: z.string(),
  label: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Language = z.infer<typeof languageSchema>

export type LanguageTranslationType = {
  id: number
  created_at: string
  updated_at: string
  label: string
  lang: AppLanguagesEnum
}

export type LanguageDetailType = {
  id: number
  created_at: string
  updated_at: string
  code: string
  translations: LanguageTranslationType[]
}

export type LanguagesApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Language[]
}

export type CreateLanguagePayloadType = {
  code: string
  translations: {
    label: string
    lang: AppLanguagesEnum
  }[]
}
