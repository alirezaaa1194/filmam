import { z } from 'zod'
import type {
  AppLanguagesEnum,
  SectionDetailType,
  SectionListItemType,
} from '../../types'

export type Section = SectionListItemType
export type SectionDetail = SectionDetailType

export type SectionsApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Section[]
}

export const sectionViewModes = [
  'HERO',
  'NORMAL_SLIDER',
  'KIDS_SLIDER',
  'HERO_LIKE_SLIDER',
  'PUZZLE',
  'ADVERTISEMENT',
] as const
export type SectionViewModeValue = (typeof sectionViewModes)[number]

export const sectionSelectionModes = [
  'AUTO',
  'USER_MOVIE',
  'SUGGESTION',
  'MANUAL',
] as const
export type SectionSelectionModeValue = (typeof sectionSelectionModes)[number]

export const sectionSortModes = [
  'NEWEST',
  'OLDEST',
  'MOST_VIEWED',
  'TOP_RATED',
  'TRENDING',
  'RANDOM',
] as const
export type SectionSortModeValue = (typeof sectionSortModes)[number]

export const sectionPeriodBases = [
  'A_DAY_AGO',
  'A_WEEK_AGO',
  'A_MONTH_AGO',
] as const
export type SectionPeriodBaseValue = (typeof sectionPeriodBases)[number]

export const sectionMovieViewModes = ['PUZZLE', 'SLIDER_ITEM'] as const
export type SectionMovieViewModeValue = (typeof sectionMovieViewModes)[number]

export type CreateSectionPayloadType = {
  slug: string
  order: number
  view_mode: SectionViewModeValue
  selection_mode: SectionSelectionModeValue
  sort_mode?: SectionSortModeValue
  period_base?: SectionPeriodBaseValue
  translations: {
    title: string
    description?: string
    language: AppLanguagesEnum
  }[]
  filters: { filter_key: string; filter_value: string }[]
  section_movies?: {
    movie_id: number
    view_mode?: SectionMovieViewModeValue
    order: number
    entity_type: 'MOVIE'
  }[]
}

export const deleteSectionsSchema = z.object({
  sections_ids: z.array(z.number()),
})
export type DeleteSectionsPayloadType = z.infer<typeof deleteSectionsSchema>
