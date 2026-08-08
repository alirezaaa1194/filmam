import { z } from 'zod'
import type { TFunction } from 'i18next'
import { AppLanguagesEnum } from '../../../types'
import {
  sectionFilterKeySchema,
  type SectionFilterKeyValue,
} from '../../headerMenus/headerMenus.type'
import { sectionTabLanguageOrder } from '../sections.data'
import {
  sectionMovieViewModes,
  sectionPeriodBases,
  sectionSelectionModes,
  sectionViewModes,
  type CreateSectionPayloadType,
  type SectionDetail,
  type SectionMovieViewModeValue,
  type SectionSelectionModeValue,
  type SectionViewModeValue,
} from '../sections.type'

export function buildSectionFormSchema(t: TFunction) {
  return z
    .object({
      slug: z
        .string()
        .min(1, t('sections.slug_required'))
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('sections.slug_invalid')),
      order: z
        .string()
        .refine(
          (value) => {
            const order = Number(value)
            return Number.isFinite(order) && order > 0
          },
          { message: t('sections.order_required') }
        ),
      view_mode: z.enum(sectionViewModes),
      selection_mode: z.enum(sectionSelectionModes),
      sort_mode: z.string(),
      period_base: z.string(),
      translations: z.array(
        z.object({
          language: z.enum(AppLanguagesEnum),
          title: z.string().min(1, t('sections.title_required')),
          description: z.string(),
        })
      ),
      filters: z.array(
        z.object({
          filter_key: sectionFilterKeySchema,
          filter_value: z.string(),
        })
      ),
      section_movies: z.array(
        z.object({
          movie_id: z.string(),
          order: z.string(),
          view_mode: z.enum(sectionMovieViewModes),
        })
      ),
    })
    .superRefine((values, ctx) => {
      if (
        values.view_mode === 'HERO' &&
        values.selection_mode !== 'MANUAL'
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('sections.errors.hero_manual_required'),
          path: ['selection_mode'],
        })
      }
      if (values.view_mode === 'HERO' && values.order !== '1') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('sections.errors.hero_order_required'),
          path: ['order'],
        })
      }
      if (
        values.view_mode === 'KIDS_SLIDER' &&
        values.translations.some((translation) => !translation.description.trim())
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('sections.errors.kids_description_required'),
          path: ['translations'],
        })
      }
      if (
        values.selection_mode === 'AUTO' &&
        values.filters.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('sections.errors.filters_required'),
          path: ['filters'],
        })
      }
      if (values.selection_mode === 'MANUAL') {
        const hasMovies = values.section_movies.some(
          (movie) => movie.movie_id.trim() !== ''
        )
        if (!hasMovies) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('sections.errors.movies_required'),
            path: ['section_movies'],
          })
        }
        if (values.view_mode === 'PUZZLE') {
          const puzzleCount = values.section_movies.filter(
            (movie) => movie.view_mode === 'PUZZLE'
          ).length
          const sliderCount = values.section_movies.filter(
            (movie) => movie.view_mode === 'SLIDER_ITEM'
          ).length
          if (puzzleCount !== 4) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('sections.errors.puzzle_items_required'),
              path: ['section_movies'],
            })
          }
          if (sliderCount < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('sections.errors.puzzle_slider_required'),
              path: ['section_movies'],
            })
          }
        }
      }
    })
}

export type SectionFormValues = z.infer<ReturnType<typeof buildSectionFormSchema>>

export function buildEmptySectionFormValues(): SectionFormValues {
  return {
    slug: '',
    order: '',
    view_mode: 'NORMAL_SLIDER',
    selection_mode: 'AUTO',
    sort_mode: '',
    period_base: '',
    translations: sectionTabLanguageOrder.map((language) => ({
      language: language as AppLanguagesEnum,
      title: '',
      description: '',
    })),
    filters: [],
    section_movies: [],
  }
}

export function buildSectionFormValuesFromDetail(
  detail: SectionDetail
): SectionFormValues {
  return {
    slug: detail.slug,
    order: String(detail.order),
    view_mode: detail.view_mode as SectionViewModeValue,
    selection_mode: detail.selection_mode as SectionSelectionModeValue,
    sort_mode: detail.sort_mode ?? '',
    period_base: detail.period_base ?? '',
    translations: sectionTabLanguageOrder.map((language) => {
      const translation = detail.translations.find(
        (item) => item.language === language
      )
      return {
        language: language as AppLanguagesEnum,
        title: translation?.title ?? '',
        description: translation?.description ?? '',
      }
    }),
    filters: detail.section_filters.map((filter) => ({
      filter_key: filter.filter_key as SectionFilterKeyValue,
      filter_value: filter.filter_value,
    })),
    section_movies: detail.section_movies.map((movie, index) => ({
      movie_id: String(movie.id),
      order: String(index + 1),
      view_mode: 'SLIDER_ITEM' as SectionMovieViewModeValue,
    })),
  }
}

export function buildSectionPayload(
  values: SectionFormValues
): CreateSectionPayloadType {
  const filters = values.filters
    .filter(
      (filter) => filter.filter_value.trim() !== '' || filter.filter_key !== 'SEARCH'
    )
    .map((filter) => ({
      filter_key: filter.filter_key,
      filter_value: filter.filter_value,
    }))

  const section_movies =
    values.selection_mode === 'MANUAL'
      ? values.section_movies
          .filter((movie) => movie.movie_id.trim() !== '')
          .map((movie, index) => ({
            movie_id: Number(movie.movie_id),
            view_mode: movie.view_mode,
            order:
              movie.order.trim() !== '' ? Number(movie.order) : index + 1,
            entity_type: 'MOVIE' as const,
          }))
      : undefined

  return {
    slug: values.slug.trim(),
    order: Number(values.order),
    view_mode: values.view_mode,
    selection_mode: values.selection_mode,
    sort_mode:
      values.sort_mode.trim() !== '' && values.selection_mode !== 'MANUAL'
        ? (values.sort_mode as CreateSectionPayloadType['sort_mode'])
        : undefined,
    period_base:
      values.period_base.trim() !== ''
        ? (values.period_base as CreateSectionPayloadType['period_base'])
        : undefined,
    translations: values.translations.map((translation) => ({
      title: translation.title,
      description:
        translation.description.trim() !== ''
          ? translation.description
          : undefined,
      language: translation.language,
    })),
    filters,
    section_movies,
  }
}

export const sectionPeriodBaseOptions: { labelKey: string; value: string }[] =
  sectionPeriodBases.map((value) => ({
    labelKey: `sections.period_bases.${value}`,
    value,
  }))
