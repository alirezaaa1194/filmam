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
import { moviesSelectApi } from '../../movies/movies.data'
import {
  getLanguageDirection,
  getLanguageFontClass,
  seasonTabLanguageOrder,
} from '../seasons.data'
import {
  buildSeasonFormSchema,
  buildSeasonPayload,
  type SeasonFilesState,
  type SeasonFormValues,
} from './seasonForm.index'
import type { CreateSeasonPayloadType } from '../seasons.type'

type SeasonFormProps = {
  formId: string
  defaultValues: SeasonFormValues
  defaultFiles?: SeasonFilesState
  initialLabels?: {
    movies?: AsyncSelectOption[]
  }
  onSubmit: (payload: CreateSeasonPayloadType) => void
}

const emptyFiles: SeasonFilesState = { poster: [], trailer: [] }

export function SeasonForm({
  formId,
  defaultValues,
  defaultFiles,
  initialLabels,
  onSubmit,
}: SeasonFormProps) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<SeasonFilesState>(
    defaultFiles ?? emptyFiles
  )

  const form = useForm<SeasonFormValues>({
    resolver: zodResolver(buildSeasonFormSchema(t)),
    defaultValues,
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })

  const handleSubmit = (values: SeasonFormValues) => {
    onSubmit(buildSeasonPayload(values, files))
  }

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='space-y-4 px-0.5'>
          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('seasons.slug')}
                </FormLabel>
                <FormControl>
                  <Input placeholder={t('seasons.slug_placeholder')} className='col-span-4' {...field} />
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
                  {t('seasons.order')}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='1'
                    step='1'
                    placeholder={t('seasons.order_placeholder')}
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
                  {t('seasons.movie')}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    className='col-span-4'
                    queryKey={['seasons', 'movies-options']}
                    api={moviesSelectApi}
                    getOptionId={(movie) => String(movie.id)}
                    getOptionLabel={(movie) => movie.title}
                    initialLabels={initialLabels?.movies}
                    value={field.value ? [field.value] : []}
                    onValueChange={(values) =>
                      field.onChange(values[0] ?? '')
                    }
                    placeholder={t('seasons.select_movie')}
                    searchPlaceholder={t('seasons.search_movies')}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-muted-foreground'>
              {t('seasons.section_files')}
            </h3>

            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
              <span className='col-span-2 pt-1.5 text-end text-sm font-medium leading-none'>
                {t('seasons.poster')}
              </span>
              <div className='col-span-4'>
                <Uploader
                  value={files.poster}
                  onChange={(value) =>
                    setFiles((prev) => ({ ...prev, poster: value }))
                  }
                  maxFiles={1}
                  fileType='image'
                  maxSizeMB={50}
                />
              </div>
            </div>

            <div className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
              <span className='col-span-2 pt-1.5 text-end text-sm font-medium leading-none'>
                {t('seasons.trailer')}
              </span>
              <div className='col-span-4'>
                <Uploader
                  value={files.trailer}
                  onChange={(value) =>
                    setFiles((prev) => ({ ...prev, trailer: value }))
                  }
                  maxFiles={1}
                  fileType='video'
                  maxSizeMB={500}
                />
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-muted-foreground'>
              {t('seasons.section_translations')}
            </h3>

            <Tabs defaultValue={seasonTabLanguageOrder[0]}>
              <TabsList className='w-full'>
                {fields.map((field) => (
                  <TabsTrigger
                    key={field.id}
                    value={field.language}
                    className='flex-1'
                  >
                    {t(`seasons.languages.${field.language}`)}
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
                          {t('seasons.title')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('seasons.title_placeholder')}
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
                          {t('seasons.short_description')}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder={t('seasons.short_description_placeholder')}
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
        </div>
      </form>
    </Form>
  )
}
