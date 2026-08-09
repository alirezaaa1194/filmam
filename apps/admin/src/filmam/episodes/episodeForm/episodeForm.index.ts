import { z } from 'zod'
import type { TFunction } from 'i18next'
import { AppLanguagesEnum, type UploadType } from '../../../types'
import { episodeTabLanguageOrder } from '../episodes.data'
import {
  type CreateEpisodePayloadType,
  type EpisodeDetailType,
  type EpisodeFilesState,
  type EpisodeUploadTypeValue,
} from '../episodes.type'

export function buildEpisodeFormSchema(t: TFunction) {
  return z.object({
    slug: z
      .string()
      .min(1, t('episodes.slug_required'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('episodes.slug_invalid')),
    order: z
      .string()
      .refine(
        (value) => {
          const order = Number(value)
          return Number.isFinite(order) && order > 0
        },
        { message: t('episodes.order_required') }
      ),
    season_id: z.string().min(1, t('episodes.season_required')),
    movie_id: z.string().min(1, t('episodes.movie_required')),
    translations: z.array(
      z.object({
        language: z.enum(AppLanguagesEnum),
        title: z.string().min(1, t('episodes.title_required')),
        short_description: z
          .string()
          .min(1, t('episodes.short_description_required')),
      })
    ),
  })
}

export type EpisodeFormValues = z.infer<ReturnType<typeof buildEpisodeFormSchema>>

export function buildEmptyEpisodeFormValues(): EpisodeFormValues {
  return {
    slug: '',
    order: '',
    season_id: '',
    movie_id: '',
    translations: episodeTabLanguageOrder.map((language) => ({
      language,
      title: '',
      short_description: '',
    })),
  }
}

export function buildEpisodeFormValuesFromDetail(
  detail: EpisodeDetailType
): EpisodeFormValues {
  return {
    slug: detail.slug,
    order: String(detail.order),
    season_id: String(detail.season_id),
    movie_id: String(detail.movie_id),
    translations: episodeTabLanguageOrder.map((language) => {
      const translation = detail.translations?.find(
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

export function buildEpisodeFilesFromDetail(
  detail: EpisodeDetailType
): EpisodeFilesState {
  const fileOf = (type: EpisodeUploadTypeValue) =>
    (detail.files ?? []).filter((file) => file.type === type)
  const film = fileOf('FILM')[0]
  return {
    poster: fileOf('POSTER'),
    cover: fileOf('COVER'),
    trailer: fileOf('TRAILER'),
    film: fileOf('FILM'),
    introStartTime:
      film?.intro_start_time != null ? String(film.intro_start_time) : '',
    introDuration:
      film?.intro_duration != null ? String(film.intro_duration) : '',
    outroDuration:
      film?.outro_duration != null ? String(film.outro_duration) : '',
  }
}

export function buildEpisodePayload(
  values: EpisodeFormValues,
  files: EpisodeFilesState
): CreateEpisodePayloadType {
  const filesPayload: CreateEpisodePayloadType['files'] = []
  const append = (
    upload: UploadType | undefined,
    uploadType: EpisodeUploadTypeValue
  ) => {
    if (upload) {
      filesPayload.push({ upload_id: upload.id, type: uploadType })
    }
  }
  append(files.poster[0], 'POSTER')
  append(files.cover[0], 'COVER')
  append(files.trailer[0], 'TRAILER')
  if (files.film[0]) {
    filesPayload.push({
      upload_id: files.film[0].id,
      type: 'FILM',
      intro_start_time:
        files.introStartTime.trim() !== ''
          ? Number(files.introStartTime)
          : undefined,
      intro_duration:
        files.introDuration.trim() !== ''
          ? Number(files.introDuration)
          : undefined,
      outro_duration:
        files.outroDuration.trim() !== ''
          ? Number(files.outroDuration)
          : undefined,
    })
  }

  return {
    slug: values.slug.trim(),
    order: Number(values.order),
    season_id: Number(values.season_id),
    translations: values.translations.map((translation) => ({
      title: translation.title,
      short_description: translation.short_description,
      language: translation.language,
    })),
    files: filesPayload,
  }
}

export function validateEpisodeFiles(
  _values: EpisodeFormValues,
  files: EpisodeFilesState,
  t: TFunction
): string | null {
  if (files.poster.length !== 1) {
    return t('episodes.errors.poster_required')
  }
  if (files.film.length !== 1) {
    return t('episodes.errors.film_required')
  }
  const times = [
    files.introStartTime,
    files.introDuration,
    files.outroDuration,
  ]
  if (
    times.some(
      (value) => value.trim() === '' || !Number.isFinite(Number(value))
    )
  ) {
    return t('episodes.errors.intro_outro_required')
  }
  return null
}
