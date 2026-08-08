import { z } from 'zod'
import type { AppLanguagesEnum } from '../../types'

export const headerMenuTypeSchema = z.union([
  z.literal('PAGE'),
  z.literal('FILTER'),
])
export type HeaderMenuTypeValue = z.infer<typeof headerMenuTypeSchema>

export const sectionFilterKeySchema = z.enum([
  'SEARCH',
  'GENRES',
  'AGE_LIMITS',
  'COUNTRIES',
  'TAGS',
  'LANGUAGES',
  'TYPE',
  'RELEASED_YEAR_FROM',
  'RELEASED_YEAR_TO',
])
export type SectionFilterKeyValue = z.infer<typeof sectionFilterKeySchema>

export type HeaderMenuFilterItem = {
  filter_key: SectionFilterKeyValue
  filter_value: string
}

export type HeaderMenuFilterRow = HeaderMenuFilterItem & {
  id: number
  created_at: string
  updated_at: string
  menu_id: number
}

export const headerMenuSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  menu_type: headerMenuTypeSchema,
  href: z.string().optional().nullable(),
  order: z.number(),
  parent_id: z.number().optional().nullable(),
  title: z.string(),
  filters: z
    .array(
      z.object({
        id: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
        filter_key: sectionFilterKeySchema,
        filter_value: z.string(),
        menu_id: z.number(),
      })
    )
    .optional(),
})
export type HeaderMenuItem = z.infer<typeof headerMenuSchema>

export type HeaderMenuTranslationType = {
  id: number
  created_at: string
  updated_at: string
  menu_id: number
  language: AppLanguagesEnum
  title: string
}

export type HeaderMenuDetailType = {
  id: number
  created_at: string
  updated_at: string
  menu_type: HeaderMenuTypeValue
  href?: string
  order: number
  parent_id?: number | null
  parent?: {
    id: number
    title?: string
    translations?: HeaderMenuTranslationType[]
  } | null
  translations: HeaderMenuTranslationType[]
  filters?: HeaderMenuFilterRow[]
}

export type HeaderMenusApiResponseType = {
  page: number
  page_size: number
  count: number
  data: HeaderMenuItem[]
}

export type CreateHeaderMenuPayloadType = {
  menu_type: HeaderMenuTypeValue
  href?: string
  order: number
  parent_id?: number
  translations: {
    language: AppLanguagesEnum
    title: string
  }[]
  filters: HeaderMenuFilterItem[]
}