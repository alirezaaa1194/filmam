'use client'

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
  AsyncSelect,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  type AsyncSelectOption,
} from '@/utilities/components'
import Uploader from '@/utilities/components/uploader/uploader.index'
import { Cn } from '@/scripts'
import { type UploadType } from '../../../types'
import {
  getLanguageDirection,
  getLanguageFontClass,
  episodeTabLanguageOrder,
  moviesSeriesSelectApi,
  movieSeasonsSelectApi,
  seasonsSelectApi,
} from '../episodes.data'
import {
  buildEpisodeFormSchema,
  buildEpisodePayload,
  validateEpisodeFiles,
  type EpisodeFormValues,
} from './episodeForm.index'
import {
  emptyEpisodeFilesState,
  type CreateEpisodePayloadType,
  type EpisodeFilesState,
} from '../episodes.type'

type EpisodeFormProps = {
  formId: string
  defaultValues: EpisodeFormValues
  defaultFiles?: EpisodeFilesState
  initialLabels?: {
    movies?: AsyncSelectOption[]
    seasons?: AsyncSelectOption[]
  }
  onSubmit: (payload: CreateEpisodePayloadType) => void
}

export function EpisodeForm({
  formId,
  defaultValues,
  defaultFiles,
  initialLabels,
  onSubmit,
}: EpisodeFormProps) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<EpisodeFilesState>(
    defaultFiles ?? emptyEpisodeFilesState
  )
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(buildEpisodeFormSchema(t)),
    defaultValues,
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedMovieId = form.watch('movie_id')

  const updateFiles =
    (key: keyof EpisodeFilesState) => (value: UploadType[]) => {
      setFiles((prev) => ({ ...prev, [key]: value }))
    }

  const handleSubmit = (values: EpisodeFormValues) => {
    const fileError = validateEpisodeFiles(values, files, t)
    if (fileError) {
      setFormError(fileError)
      return
    }
    setFormError(null)
    onSubmit(buildEpisodePayload(values, files))
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-5'
      >
        {formError && (
          <div className='rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive'>
            {formError}
          </div>
        )}

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('episodes.section_basic')}
          </h3>

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('episodes.slug')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('episodes.slug_placeholder')}
                    className='col-span-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='order'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('episodes.order')}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='1'
                    step='1'
                    placeholder={t('episodes.order_placeholder')}
                    className='col-span-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='movie_id'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('episodes.movie')}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    className='col-span-4'
                    queryKey={['episodes', 'movies-options']}
                    api={moviesSeriesSelectApi}
                    getOptionId={(movie) => String(movie.id)}
                    getOptionLabel={(movie) => movie.title}
                    initialLabels={initialLabels?.movies}
                    value={field.value ? [field.value] : []}
                    onValueChange={(values) => {
                      const movieId = values[0] ?? ''
                      field.onChange(movieId)
                      form.setValue('season_id', '')
                    }}
                    placeholder={t('episodes.select_movie')}
                    searchPlaceholder={t('episodes.search_movies')}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='season_id'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('episodes.season')}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    className='col-span-4'
                    queryKey={['episodes', 'seasons-options', watchedMovieId]}
                    api={
                      watchedMovieId
                        ? movieSeasonsSelectApi(Number(watchedMovieId))
                        : seasonsSelectApi
                    }
                    getOptionId={(season) => String(season.id)}
                    getOptionLabel={(season) => season.title}
                    initialLabels={initialLabels?.seasons}
                    value={field.value ? [field.value] : []}
                    onValueChange={(values) =>
                      field.onChange(values[0] ?? '')
                    }
                    placeholder={t('episodes.select_season')}
                    searchPlaceholder={t('episodes.search_seasons')}
                    disabled={!watchedMovieId}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('episodes.section_files')}
          </h3>

          <FileUploadField
            label={t('episodes.poster')}
            fileType='image'
            value={files.poster}
            onChange={updateFiles('poster')}
          />
          <FileUploadField
            label={t('episodes.cover')}
            fileType='image'
            value={files.cover}
            onChange={updateFiles('cover')}
          />
          <FileUploadField
            label={t('episodes.trailer')}
            fileType='video'
            value={files.trailer}
            onChange={updateFiles('trailer')}
          />
          <FileUploadField
            label={t('episodes.film')}
            fileType='video'
            value={files.film}
            onChange={updateFiles('film')}
            maxSizeMB={5000}
          />

          {files.film.length > 0 && (
            <div className='grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-3'>
              <TimingInput
                label={t('episodes.intro_start_time')}
                value={files.introStartTime}
                onChange={(value) =>
                  setFiles((prev) => ({ ...prev, introStartTime: value }))
                }
              />
              <TimingInput
                label={t('episodes.intro_duration')}
                value={files.introDuration}
                onChange={(value) =>
                  setFiles((prev) => ({ ...prev, introDuration: value }))
                }
              />
              <TimingInput
                label={t('episodes.outro_duration')}
                value={files.outroDuration}
                onChange={(value) =>
                  setFiles((prev) => ({ ...prev, outroDuration: value }))
                }
              />
            </div>
          )}
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('episodes.section_translations')}
          </h3>

          <Tabs defaultValue={episodeTabLanguageOrder[0]}>
            <TabsList className='w-full'>
              {fields.map((field) => (
                <TabsTrigger
                  key={field.id}
                  value={field.language}
                  className='flex-1'
                >
                  {t(`episodes.languages.${field.language}`)}
                </TabsTrigger>
              ))}
            </TabsList>

            {fields.map((field, index) => (
              <TabsContent
                key={field.id}
                value={field.language}
                className='mt-2 space-y-4'
              >
                <FormField
                  control={form.control}
                  name={`translations.${index}.title`}
                  render={({ field: titleField }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        {t('episodes.title')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('episodes.title_placeholder')}
                          dir={getLanguageDirection(field.language)}
                          className={Cn(
                            'col-span-4',
                            getLanguageFontClass(field.language)
                          )}
                          {...titleField}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`translations.${index}.short_description`}
                  render={({ field: shortField }) => (
                    <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 pt-1.5 text-end'>
                        {t('episodes.short_description')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder={t('episodes.short_description_placeholder')}
                          dir={getLanguageDirection(field.language)}
                          className={Cn(
                            'col-span-4 resize-none',
                            getLanguageFontClass(field.language)
                          )}
                          {...shortField}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </form>
    </Form>
  )
}

function FileUploadField({
  label,
  fileType,
  value,
  onChange,
  maxSizeMB,
}: {
  label: string
  fileType: 'image' | 'video'
  value: UploadType[]
  onChange: (files: UploadType[]) => void
  maxSizeMB?: number
}) {
  return (
    <div className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
      <span className='col-span-2 pt-1.5 text-end text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
        {label}
      </span>
      <div className='col-span-4'>
        <Uploader
          value={value}
          onChange={onChange}
          maxFiles={1}
          fileType={fileType}
          maxSizeMB={maxSizeMB ?? 50}
        />
      </div>
    </div>
  )
}

function TimingInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const { t } = useTranslation()
  return (
    <div className='space-y-1.5'>
      <label className='text-xs font-medium text-muted-foreground'>
        {label}
      </label>
      <Input
        type='number'
        min='0'
        step='1'
        placeholder={t('episodes.timing_placeholder')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
