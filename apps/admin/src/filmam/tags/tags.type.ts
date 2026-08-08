import { z } from 'zod'
import type { AppLanguagesEnum } from '../../types'

export const tagSchema = z.object({
  id: z.number(),
  slug: z.string(),
  label: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Tag = z.infer<typeof tagSchema>

export type TagTranslationType = {
  id: number
  created_at: string
  updated_at: string
  label: string
  language: AppLanguagesEnum
}

export type TagDetailType = {
  id: number
  created_at: string
  updated_at: string
  slug: string
  translations: TagTranslationType[]
}

export type TagsApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Tag[]
}

export type CreateTagPayloadType = {
  slug: string
  translations: {
    label: string
    lang: AppLanguagesEnum
  }[]
}
