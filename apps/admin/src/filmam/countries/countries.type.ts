import { z } from 'zod'
import type { AppLanguagesEnum } from '../../types'

export const countrySchema = z.object({
  id: z.number(),
  code: z.string(),
  label: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Country = z.infer<typeof countrySchema>

export type CountryTranslationType = {
  id: number
  created_at: string
  updated_at: string
  country_id: number
  label: string
  language: AppLanguagesEnum
}

export type CountryDetailType = {
  id: number
  created_at: string
  updated_at: string
  code: string
  translations: CountryTranslationType[]
}

export type CountriesApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Country[]
}

export type CreateCountryPayloadType = {
  code: string
  translations: {
    label: string
    lang: AppLanguagesEnum
  }[]
}
