import { z } from 'zod'
import type { TFunction } from 'i18next'
import {
  AppLanguagesEnum,
  type MovieDetailPublicType,
  type MovieFileType,
  type UploadType,
} from '../../../types'
import { movieTabLanguageOrder } from '../movies.data'
import {
  movieTypes,
  type CreateMoviePayloadType,
  type MovieDetailType,
  type MovieFilesState,
  type MovieTypeValue,
} from '../movies.type'

export function buildMovieFormSchema(t: TFunction) {
  return z
    .object({
      type: z.enum(movieTypes),
      slug: z
        .string()
        .min(1, t('movies.slug_required'))
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('movies.slug_invalid')),
      released_year: z
        .string()
        .refine(
          (value) => {
            const year = Number(value)
            return Number.isFinite(year) && year >= 1900 && year <= 2100
          },
          { message: t('movies.released_year_required') }
        ),
      age_limit: z
        .string()
        .refine(
          (value) =>
            value.trim() === '' ||
            (Number.isFinite(Number(value)) && Number(value) >= 0),
          { message: t('movies.age_limit_invalid') }
        ),
      combined_tags: z.string().min(1, t('movies.combined_tags_required')),
      genres: z.array(z.string()).min(1, t('movies.genres_required')),
      tags: z.array(z.string()).min(1, t('movies.tags_required')),
      countries: z.array(z.string()).min(1, t('movies.countries_required')),
      languages: z.array(z.string()).min(1, t('movies.languages_required')),
      factors: z.array(
        z.object({
          factor_id: z.string().min(1, t('movies.factor_required')),
          role_id: z.string().min(1, t('movies.factor_role_required')),
        })
      ),
      translations: z.array(
        z.object({
          language: z.enum(AppLanguagesEnum),
          title: z.string().min(1, t('movies.title_required')),
          short_description: z
            .string()
            .min(1, t('movies.short_description_required')),
          description: z.string().min(1, t('movies.description_required')),
        })
      ),
    })
}

export type MovieFormValues = z.infer<ReturnType<typeof buildMovieFormSchema>>

export function buildEmptyMovieFormValues(): MovieFormValues {
  return {
    type: 'CINEMATIC',
    slug: '',
    released_year: '',
    age_limit: '',
    combined_tags: '',
    genres: [],
    tags: [],
    countries: [],
    languages: [],
    factors: [],
    translations: movieTabLanguageOrder.map((language) => ({
      language,
      title: '',
      short_description: '',
      description: '',
    })),
  }
}

export function buildMovieFormValuesFromDetail(
  detail: MovieDetailType,
  publicDetail?: MovieDetailPublicType
): MovieFormValues {
  const languageIds = new Set(
    (publicDetail?.languages ?? []).map((language) => String(language.id))
  )
  const countryIds = new Set(
    (publicDetail?.countries ?? []).map((country) => String(country.id))
  )

  const factors = detail.factors.map((factor) => {
    const publicFactor = publicDetail?.factors?.find(
      (publicItem) => publicItem.id === factor.id
    )
    return {
      factor_id: String(factor.id),
      role_id:
        publicFactor?.role != null ? String(publicFactor.role.id) : '',
    }
  })

  return {
    type: detail.type as MovieTypeValue,
    slug: detail.slug,
    released_year: String(detail.released_year),
    age_limit: detail.age_limit != null ? String(detail.age_limit) : '',
    combined_tags: detail.combined_tags ?? '',
    genres: detail.genres.map((genre) => String(genre.id)),
    tags: detail.tags.map((tag) => String(tag.id)),
    countries: Array.from(countryIds),
    languages: Array.from(languageIds),
    factors: factors.map(({ factor_id, role_id }) => ({
      factor_id,
      role_id,
    })),
    translations: movieTabLanguageOrder.map((language) => {
      const translation = detail.translations.find(
        (item) => item.language === language
      )
      return {
        language,
        title: translation?.title ?? '',
        short_description: translation?.short_description ?? '',
        description: translation?.description ?? '',
      }
    }),
  }
}

export function buildMovieFilesFromDetail(
  detail: MovieDetailType
): MovieFilesState {
  const fileOf = (type: MovieFileType['type']) =>
    detail.files.filter((file) => file.type === type)
  const film = fileOf('FILM')[0]
  return {
    poster: fileOf('POSTER'),
    thumbnail: fileOf('THUMBNAIL'),
    banner: fileOf('BANNER'),
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

export function buildMoviePayload(
  values: MovieFormValues,
  files: MovieFilesState
): CreateMoviePayloadType {
  const filesPayload: CreateMoviePayloadType['files'] = []
  const append = (
    upload: UploadType | undefined,
    uploadType: CreateMoviePayloadType['files'][number]['upload_type']
  ) => {
    if (upload) {
      filesPayload.push({ upload_id: upload.id, upload_type: uploadType })
    }
  }
  append(files.poster[0], 'POSTER')
  append(files.thumbnail[0], 'THUMBNAIL')
  append(files.banner[0], 'BANNER')
  append(files.trailer[0], 'TRAILER')
  if (files.film[0]) {
    filesPayload.push({
      upload_id: files.film[0].id,
      upload_type: 'FILM',
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
    type: values.type,
    slug: values.slug.trim(),
    released_year: Number(values.released_year),
    age_limit:
      values.age_limit.trim() !== '' ? Number(values.age_limit) : undefined,
    combined_tags: values.combined_tags.trim(),
    genres: values.genres.map(Number),
    tags: values.tags.map(Number),
    countries: values.countries.map(Number),
    languages: values.languages.map(Number),
    factors: values.factors.map((factor, index) => ({
      factor_id: Number(factor.factor_id),
      role_id: Number(factor.role_id),
      order: index + 1,
      translations: values.translations.map((translation) => ({
        lang: translation.language,
      })),
    })),
    translations: values.translations.map((translation) => ({
      title: translation.title,
      short_description: translation.short_description,
      description: translation.description,
      language: translation.language,
    })),
    files: filesPayload,
  }
}

export function validateMovieFiles(
  values: MovieFormValues,
  files: MovieFilesState,
  t: TFunction
): string | null {
  if (files.poster.length !== 1) {
    return t('movies.errors.poster_required')
  }
  if (files.thumbnail.length !== 1) {
    return t('movies.errors.thumbnail_required')
  }
  if (values.type === 'CINEMATIC') {
    if (files.film.length !== 1) {
      return t('movies.errors.film_required')
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
      return t('movies.errors.intro_outro_required')
    }
  } else if (files.film.length > 0) {
    return t('movies.errors.series_film_forbidden')
  }
  return null
}