import { z } from 'zod'
import type { AppLanguagesEnum, FactorUploadType } from '../../types'

export const factorProfileSchema = z.object({
  id: z.number(),
  path: z.string(),
  type: z.string(),
})
export type FactorProfile = z.infer<typeof factorProfileSchema>

export const factorSchema = z.object({
  id: z.number(),
  slug: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  profile: factorProfileSchema.optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Factor = z.infer<typeof factorSchema>

export type FactorTranslationType = {
  id: number
  created_at: string
  updated_at: string
  factor_id: number
  first_name: string
  last_name: string
  language: AppLanguagesEnum
}

export type FactorDetailType = {
  id: number
  created_at: string
  updated_at: string
  slug: string
  profile?: FactorUploadType
  translations: FactorTranslationType[]
}

export type FactorsApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Factor[]
}

export type CreateFactorPayloadType = {
  slug: string
  profile?: {
    upload_id: number
    upload_type: 'PROFILE'
  }
  translations: {
    first_name: string
    last_name: string
    lang: AppLanguagesEnum
  }[]
}
