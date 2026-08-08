'use client'

import { useState, type DragEvent } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Plus, GripVertical, X } from 'lucide-react'
import {
  AsyncSelect,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  countriesSelectApi,
  factorSelectLabel,
  factorsSelectApi,
  genresSelectApi,
  getLanguageDirection,
  getLanguageFontClass,
  languagesSelectApi,
  movieTabLanguageOrder,
  rolesSelectApi,
  tagsSelectApi,
} from '../movies.data'
import {
  buildMovieFormSchema,
  buildMoviePayload,
  validateMovieFiles,
  type MovieFormValues,
} from './movieForm.index'
import {
  emptyMovieFilesState,
  movieTypes,
  type CreateMoviePayloadType,
  type MovieFilesState,
} from '../movies.type'

type MovieFormProps = {
  formId: string
  defaultValues: MovieFormValues
  defaultFiles?: MovieFilesState
  initialLabels?: {
    genres?: AsyncSelectOption[]
    tags?: AsyncSelectOption[]
    countries?: AsyncSelectOption[]
    languages?: AsyncSelectOption[]
    factors?: AsyncSelectOption[]
    roles?: AsyncSelectOption[]
  }
  onSubmit: (payload: CreateMoviePayloadType) => void
}

export function MovieForm({
  formId,
  defaultValues,
  defaultFiles,
  initialLabels,
  onSubmit,
}: MovieFormProps) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<MovieFilesState>(
    defaultFiles ?? emptyMovieFilesState
  )
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(buildMovieFormSchema(t)),
    defaultValues,
  })
  const { fields: translationFields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const {
    fields: factorFields,
    append: appendFactor,
    remove: removeFactor,
    move: moveFactor,
  } = useFieldArray({
    control: form.control,
    name: 'factors',
  })

  const [draggedFactorIndex, setDraggedFactorIndex] = useState<number | null>(
    null
  )
  const [dragOverFactorIndex, setDragOverFactorIndex] = useState<
    number | null
  >(null)

  const handleFactorDragStart = (index: number) => {
    setDraggedFactorIndex(index)
  }

  const handleFactorDragOver = (e: DragEvent, index: number) => {
    e.preventDefault()
    if (dragOverFactorIndex !== index) {
      setDragOverFactorIndex(index)
    }
  }

  const handleFactorDrop = (index: number) => {
    if (draggedFactorIndex != null && draggedFactorIndex !== index) {
      moveFactor(draggedFactorIndex, index)
    }
    setDraggedFactorIndex(null)
    setDragOverFactorIndex(null)
  }

  const handleFactorDragEnd = () => {
    setDraggedFactorIndex(null)
    setDragOverFactorIndex(null)
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedType = form.watch('type')
  const watchedFactors = form.watch('factors')

  const updateFiles =
    (key: keyof MovieFilesState) => (value: UploadType[]) => {
      setFiles((prev) => ({ ...prev, [key]: value }))
    }

  const addFactor = () => {
    appendFactor({ factor_id: '', role_id: '' })
  }

  const handleSubmit = (values: MovieFormValues) => {
    const fileError = validateMovieFiles(values, files, t)
    if (fileError) {
      setFormError(fileError)
      return
    }
    setFormError(null)
    onSubmit(buildMoviePayload(values, files))
  }

  const selectedFactorIds = watchedFactors.map((factor) => factor.factor_id)

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
            {t('movies.section_basic')}
          </h3>

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.type')}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='col-span-4'>
                      <SelectValue placeholder={t('movies.select_type')} />
                    </SelectTrigger>
                    <SelectContent>
                      {movieTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`movies.type_${type.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.slug')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., the-godfather'
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
            name='released_year'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.released_year')}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='1900'
                    max='2100'
                    placeholder='2024'
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
            name='age_limit'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.age_limit')}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='0'
                    placeholder='18'
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
            name='combined_tags'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.combined_tags')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., drama, crime, oscar'
                    className='col-span-4'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('movies.section_relations')}
          </h3>

          <FormField
            control={form.control}
            name='genres'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.genres')}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    className='col-span-4'
                    multiple
                    queryKey={['movies', 'genres-options']}
                    api={genresSelectApi}
                    getOptionId={(genre) => String(genre.id)}
                    getOptionLabel={(genre) => genre.name}
                    initialLabels={initialLabels?.genres}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('movies.select_genres')}
                    searchPlaceholder={t('movies.search_genres')}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.tags')}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    className='col-span-4'
                    multiple
                    queryKey={['movies', 'tags-options']}
                    api={tagsSelectApi}
                    getOptionId={(tag) => String(tag.id)}
                    getOptionLabel={(tag) => tag.label}
                    initialLabels={initialLabels?.tags}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('movies.select_tags')}
                    searchPlaceholder={t('movies.search_tags')}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='countries'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.countries')}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    className='col-span-4'
                    multiple
                    queryKey={['movies', 'countries-options']}
                    api={countriesSelectApi}
                    getOptionId={(country) => String(country.id)}
                    getOptionLabel={(country) => country.label}
                    initialLabels={initialLabels?.countries}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('movies.select_countries')}
                    searchPlaceholder={t('movies.search_countries')}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='languages'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('movies.languages_label')}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    className='col-span-4'
                    multiple
                    queryKey={['movies', 'languages-options']}
                    api={languagesSelectApi}
                    getOptionId={(language) => String(language.id)}
                    getOptionLabel={(language) => language.label}
                    initialLabels={initialLabels?.languages}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('movies.select_languages')}
                    searchPlaceholder={t('movies.search_languages')}
                  />
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('movies.section_factors')}
          </h3>

          {factorFields.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              {t('movies.no_factors_yet')}
            </p>
          )}

          {factorFields.map((factorField, index) => {
            const excludedFactors = selectedFactorIds.filter(
              (factorId, factorIndex) => factorIndex !== index && factorId
            )
            return (
              <div
                key={factorField.id}
                draggable
                onDragStart={() => handleFactorDragStart(index)}
                onDragOver={(e) => handleFactorDragOver(e, index)}
                onDrop={() => handleFactorDrop(index)}
                onDragEnd={handleFactorDragEnd}
                className={Cn(
                  'space-y-3 rounded-lg border p-3',
                  dragOverFactorIndex === index &&
                    draggedFactorIndex !== index &&
                    'border-primary'
                )}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <GripVertical className='size-4 cursor-grab text-muted-foreground active:cursor-grabbing' />
                    <span className='text-sm font-medium'>
                      {t('movies.factor_number', { index: index + 1 })}
                    </span>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-7'
                    onClick={() => removeFactor(index)}
                    aria-label={t('movies.remove_factor')}
                  >
                    <X className='size-4' />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`factors.${index}.factor_id`}
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        {t('movies.factor')}
                      </FormLabel>
                      <FormControl>
                        <AsyncSelect
                          className='col-span-4'
                          queryKey={['movies', 'factors-options']}
                          api={factorsSelectApi}
                          getOptionId={(factor) => String(factor.id)}
                          getOptionLabel={factorSelectLabel}
                          initialLabels={initialLabels?.factors}
                          excludeValues={excludedFactors}
                          value={
                            field.value ? [field.value] : []
                          }
                          onValueChange={(values) =>
                            field.onChange(values[0] ?? '')
                          }
                          placeholder={t('movies.select_factor')}
                          searchPlaceholder={t('movies.search_factors')}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`factors.${index}.role_id`}
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        {t('movies.role')}
                      </FormLabel>
                      <FormControl>
                        <AsyncSelect
                          className='col-span-4'
                          queryKey={['movies', 'roles-options']}
                          api={rolesSelectApi}
                          getOptionId={(role) => String(role.id)}
                          getOptionLabel={(role) => role.name}
                          initialLabels={initialLabels?.roles}
                          value={field.value ? [field.value] : []}
                          onValueChange={(values) =>
                            field.onChange(values[0] ?? '')
                          }
                          placeholder={t('movies.select_role')}
                          searchPlaceholder={t('movies.search_roles')}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              </div>
            )
          })}

          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={addFactor}
          >
            <Plus className='size-4' /> {t('movies.add_factor')}
          </Button>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('movies.section_files')}
          </h3>

          <FileUploadField
            label={t('movies.poster')}
            fileType='image'
            value={files.poster}
            onChange={updateFiles('poster')}
          />
          <FileUploadField
            label={t('movies.thumbnail')}
            fileType='image'
            value={files.thumbnail}
            onChange={updateFiles('thumbnail')}
          />
          <FileUploadField
            label={t('movies.banner')}
            fileType='image'
            value={files.banner}
            onChange={updateFiles('banner')}
          />
          <FileUploadField
            label={t('movies.trailer')}
            fileType='video'
            value={files.trailer}
            onChange={updateFiles('trailer')}
          />
          <FileUploadField
            label={t('movies.film')}
            fileType='video'
            value={files.film}
            onChange={updateFiles('film')}
            maxSizeMB={5000}
          />

          {watchedType === 'CINEMATIC' && files.film.length > 0 && (
            <div className='grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-3'>
              <TimingInput
                label={t('movies.intro_start_time')}
                value={files.introStartTime}
                onChange={(value) =>
                  setFiles((prev) => ({ ...prev, introStartTime: value }))
                }
              />
              <TimingInput
                label={t('movies.intro_duration')}
                value={files.introDuration}
                onChange={(value) =>
                  setFiles((prev) => ({ ...prev, introDuration: value }))
                }
              />
              <TimingInput
                label={t('movies.outro_duration')}
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
            {t('movies.section_translations')}
          </h3>

          <Tabs defaultValue={movieTabLanguageOrder[0]}>
            <TabsList className='w-full'>
              {translationFields.map((field) => (
                <TabsTrigger
                  key={field.id}
                  value={field.language}
                  className='flex-1'
                >
                  {t(`movies.languages.${field.language}`)}
                </TabsTrigger>
              ))}
            </TabsList>

            {translationFields.map((field, index) => (
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
                        {t('movies.title')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('movies.title_placeholder')}
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
                        {t('movies.short_description')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('movies.short_description_placeholder')}
                          dir={getLanguageDirection(field.language)}
                          className={Cn(
                            'col-span-4',
                            getLanguageFontClass(field.language)
                          )}
                          {...shortField}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`translations.${index}.description`}
                  render={({ field: descriptionField }) => (
                    <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 pt-1.5 text-end'>
                        {t('movies.description')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder={t('movies.description_placeholder')}
                          dir={getLanguageDirection(field.language)}
                          className={Cn(
                            'col-span-4 resize-none',
                            getLanguageFontClass(field.language)
                          )}
                          {...descriptionField}
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
  return (
    <div className='space-y-1.5'>
      <label className='text-xs font-medium text-muted-foreground'>
        {label}
      </label>
      <Input
        type='number'
        min='0'
        step='1'
        placeholder='0'
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
