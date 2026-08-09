'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
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
import { Cn } from '@/scripts'
import { moviesSelectApi } from '../../movies/movies.data'
import { FiltersEditor } from '../../headerMenus/filtersEditor/filtersEditor.index'
import {
  getLanguageDirection,
  getLanguageFontClass,
} from '../sections.data'
import {
  sectionMovieViewModes,
  sectionSelectionModes,
  sectionSortModes,
  sectionViewModes,
  type CreateSectionPayloadType,
  type SectionMovieViewModeValue,
} from '../sections.type'
import {
  buildSectionFormSchema,
  buildSectionPayload,
  sectionPeriodBaseOptions,
  type SectionFormValues,
} from './sectionForm.index'

type SectionFormProps = {
  formId: string
  defaultValues: SectionFormValues
  initialLabels?: {
    movies?: AsyncSelectOption[]
  }
  onSubmit: (payload: CreateSectionPayloadType) => void
}

export function SectionForm({
  formId,
  defaultValues,
  initialLabels,
  onSubmit,
}: SectionFormProps) {
  const { t } = useTranslation()

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(buildSectionFormSchema(t)),
    defaultValues,
  })
  const { fields: translationFields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const {
    fields: movieFields,
    append: appendMovie,
    remove: removeMovie,
  } = useFieldArray({
    control: form.control,
    name: 'section_movies',
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedSelectionMode = form.watch('selection_mode')
  const watchedViewMode = form.watch('view_mode')
  const watchedSectionMovies = form.watch('section_movies')

  const handleSubmit = (values: SectionFormValues) => {
    onSubmit(buildSectionPayload(values))
  }

  const addMovie = () => {
    appendMovie({ movie_id: '', order: '', view_mode: 'SLIDER_ITEM' })
  }

  const selectedMovieIds = watchedSectionMovies.map(
    (movie) => movie.movie_id
  )

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-5'
      >
        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('sections.section_basic')}
          </h3>

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('sections.slug')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('sections.slug_placeholder')}
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
                  {t('sections.order')}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min='1'
                    step='1'
                    placeholder={t('sections.order_placeholder')}
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
            name='view_mode'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('sections.view_mode')}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='col-span-4'>
                      <SelectValue placeholder={t('sections.select_view_mode')} />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionViewModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {t(`sections.view_modes.${mode}`)}
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
            name='selection_mode'
            render={({ field }) => (
              <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                <FormLabel className='col-span-2 text-end'>
                  {t('sections.selection_mode')}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='col-span-4'>
                      <SelectValue
                        placeholder={t('sections.select_selection_mode')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionSelectionModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {t(`sections.selection_modes.${mode}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className='col-span-4 col-start-3' />
              </FormItem>
            )}
          />

          {watchedSelectionMode !== 'MANUAL' && (
            <>
              <FormField
                control={form.control}
                name='sort_mode'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('sections.sort_mode')}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger className='col-span-4'>
                          <SelectValue
                            placeholder={t('sections.select_sort_mode')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=''>
                            {t('common.none')}
                          </SelectItem>
                          {sectionSortModes.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {t(`sections.sort_modes.${mode}`)}
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
                name='period_base'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('sections.period_base')}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger className='col-span-4'>
                          <SelectValue
                            placeholder={t('sections.select_period_base')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=''>
                            {t('common.none')}
                          </SelectItem>
                          {sectionPeriodBaseOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {watchedSelectionMode === 'AUTO' && (
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-muted-foreground'>
              {t('sections.section_filters')}
            </h3>

            <FormField
              control={form.control}
              name='filters'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FiltersEditor
                      filters={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className='ms-auto text-end' />
                </FormItem>
              )}
            />
          </div>
        )}

        {watchedSelectionMode === 'MANUAL' && (
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-muted-foreground'>
              {t('sections.section_movies')}
            </h3>

            {movieFields.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                {t('sections.no_movies_yet')}
              </p>
            )}

            {movieFields.map((movieField, index) => (
              <div
                key={movieField.id}
                className='space-y-3 rounded-lg border p-3'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    {t('sections.movie_number', { index: index + 1 })}
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-7'
                    onClick={() => removeMovie(index)}
                    aria-label={t('sections.remove_movie')}
                  >
                    <X className='size-4' />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`section_movies.${index}.movie_id`}
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        {t('sections.movie')}
                      </FormLabel>
                      <FormControl>
                        <AsyncSelect
                          className='col-span-4'
                          queryKey={['sections', 'movies-options']}
                          api={moviesSelectApi}
                          getOptionId={(movie) => String(movie.id)}
                          getOptionLabel={(movie) => movie.title}
                          initialLabels={initialLabels?.movies}
                          excludeValues={selectedMovieIds.filter(
                            (id, movieIndex) =>
                              movieIndex !== index && id.trim() !== ''
                          )}
                          value={field.value ? [field.value] : []}
                          onValueChange={(values) =>
                            field.onChange(values[0] ?? '')
                          }
                          placeholder={t('sections.select_movie')}
                          searchPlaceholder={t('sections.search_movies')}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`section_movies.${index}.order`}
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        {t('sections.movie_order')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='1'
                          step='1'
                          placeholder={String(index + 1)}
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />

                {watchedViewMode === 'PUZZLE' && (
                  <FormField
                    control={form.control}
                    name={`section_movies.${index}.view_mode`}
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          {t('sections.movie_view_mode')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value as SectionMovieViewModeValue)
                            }
                            value={field.value}
                          >
                            <SelectTrigger className='col-span-4'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {sectionMovieViewModes.map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                  {t(`sections.movie_view_modes.${mode}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}

            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={addMovie}
            >
              <Plus className='size-4' /> {t('sections.add_movie')}
            </Button>
          </div>
        )}

        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {t('sections.section_translations')}
          </h3>

          <Tabs defaultValue='EN'>
            <TabsList className='w-full'>
              {translationFields.map((field) => (
                <TabsTrigger
                  key={field.id}
                  value={field.language}
                  className='flex-1'
                >
                  {t(`sections.languages.${field.language}`)}
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
                        {t('sections.title')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('sections.title_placeholder')}
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
                  name={`translations.${index}.description`}
                  render={({ field: descriptionField }) => (
                    <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 pt-1.5 text-end'>
                        {t('sections.description')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder={t('sections.description_placeholder')}
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
