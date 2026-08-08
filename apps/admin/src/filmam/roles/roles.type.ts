import { z } from 'zod'
import type { AppLanguagesEnum } from '../../types'

export const roleTypeSchema = z.union([
  z.literal('CREATOR'),
  z.literal('ACTOR'),
])
export type RoleTypeValue = z.infer<typeof roleTypeSchema>

export const roleSchema = z.object({
  id: z.number(),
  slug: z.string(),
  type: roleTypeSchema,
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Role = z.infer<typeof roleSchema>

export type RoleTranslationType = {
  id: number
  created_at: string
  updated_at: string
  role_id: number
  name: string
  language: AppLanguagesEnum
}

export type RoleDetailType = {
  id: number
  created_at: string
  updated_at: string
  slug: string
  type: RoleTypeValue
  translations: RoleTranslationType[]
}

export type RolesApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Role[]
}

export type CreateRolePayloadType = {
  slug: string
  type: RoleTypeValue
  translations: {
    name: string
    lang: AppLanguagesEnum
  }[]
}
