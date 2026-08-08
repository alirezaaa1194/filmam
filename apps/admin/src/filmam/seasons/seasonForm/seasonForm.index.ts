import { z } from 'zod'
import type { TFunction } from 'i18next'
import {
  AppLanguagesEnum,
  type SeasonDetailType,
  type UploadType,
} from '../../../types'
import { seasonTabLanguageOrder } from '../seasons.data'
import type { CreateSeasonPayloadType } from '../seasons.type'

export function buildSeasonFormSchema(t: TFunction) {
  return z.object({
    slug: z
      .string()
      .min(1, t('seasons.slug_required'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('seasons.slug_invalid')),
    order: z
      .string()
      .refine(
        (value) => Number.isFinite(Number(value)) && Number(value) > 0,
        { message: t('seasons.order_required') }
      ),
    movie_id: z.string().min(1, t('seasons.movie_required')),
    translations: z.array(
      z.object({
        language: z.enum(AppLanguagesEnum),
        title: z.string().min(1, t('seasons.title_required')),
        short_description: z
          .string()
          .min(1, t('seasons.short_description_required')),
      })
    ),
  })
}

export type SeasonFormValues = z.infer<ReturnType<typeof buildSeasonFormSchema>>

export function buildEmptySeasonFormValues(): SeasonFormValues {
  return {
    slug: '',
    order: '',
    movie_id: '',
    translations: seasonTabLanguageOrder.map((language) => ({
      language,
      title: '',
      short_description: '',
    })),
  }
}

export function buildSeasonFormValuesFromDetail(
  detail: SeasonDetailType
): SeasonFormValues {
  return {
    slug: detail.slug,
    order: String(detail.order),
    movie_id: String(detail.movie_id),
    translations: seasonTabLanguageOrder.map((language) => {
      const translation = detail.translations.find(
        (item) => item.language === language
      )
      return {
        language,
        title: translation?.title ?? '',
        short_description: translation?.short_description ?? '',
      }
    }),
  }
}

export type SeasonFilesState = {
  poster: UploadType[]
  trailer: UploadType[]
}

export function buildSeasonFilesFromDetail(
  detail: SeasonDetailType
): SeasonFilesState {
  return {
    poster: detail.files.filter((file) => file.type === 'POSTER'),
    trailer: detail.files.filter((file) => file.type === 'TRAILER'),
  }
}

export function buildSeasonPayload(
  values: SeasonFormValues,
  files: SeasonFilesState
): CreateSeasonPayloadType {
  const filesPayload: CreateSeasonPayloadType['files'] = []
  const append = (
    upload: UploadType | undefined,
    type: CreateSeasonPayloadType['files'][number]['type']
  ) => {
    if (upload) {
      filesPayload.push({ upload_id: upload.id, type })
    }
  }
  append(files.poster[0], 'POSTER')
  append(files.trailer[0], 'TRAILER')

  return {
    slug: values.slug.trim(),
    order: Number(values.order),
    movie_id: Number(values.movie_id),
    translations: values.translations.map((translation) => ({
      title: translation.title,
      short_description: translation.short_description,
      language: translation.language,
    })),
    files: filesPayload,
  }
}
