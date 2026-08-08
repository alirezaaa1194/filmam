'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, Cn, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import { AppLanguagesEnum } from '../../../types'
import {
  genreTabLanguageOrder,
  getLanguageDirection,
  getLanguageFontClass,
} from '../genres.data'
import type { CreateGenrePayloadType } from '../genres.type'

type GenreAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGenreDialog({ open, onOpenChange }: GenreAddDialogProps) {
  const { t } = useTranslation()

  const formSchema = z.object({
    slug: z
      .string()
      .min(1, t('genres.slug_required'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('genres.slug_invalid')),
    translations: z.array(
      z.object({
        lang: z.enum(AppLanguagesEnum),
        name: z.string().min(1, t('genres.name_required')),
      })
    ),
  })

  type GenreForm = z.infer<typeof formSchema>

  const form = useForm<GenreForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: '',
      translations: genreTabLanguageOrder.map(
        (lang) =>
          ({
            lang: lang as GenreForm['translations'][number]['lang'],
            name: '',
          }) as GenreForm['translations'][number]
      ),
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: GenreForm) =>
      Api(AppApis.genre.adminCreate, {
        method: 'POST',
        body: {
          slug: data.slug,
          translations: data.translations.map(({ lang, name }) => ({
            lang,
            name,
          })),
        } satisfies CreateGenrePayloadType,
      }),
    onSuccess: () => {
      toast.success(t('genres.genre_created'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['genres'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: GenreForm) => {
    mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('genres.add_genre')}</DialogTitle>
          <DialogDescription>{t('genres.add_genre_desc')}</DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='genre-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('genres.slug')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., action'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <Tabs
                defaultValue={genreTabLanguageOrder[0]}
                className='col-span-6'
              >
                <TabsList className='w-full'>
                  {fields.map((field) => (
                    <TabsTrigger
                      key={field.id}
                      value={field.lang}
                      className='flex-1'
                    >
                      {t(`genres.languages.${field.lang}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {fields.map((field, index) => (
                  <TabsContent
                    key={field.id}
                    value={field.lang}
                    className='mt-2 space-y-4'
                  >
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`translations.${index}.name`}
                      render={({ field: nameField }) => (
                        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                          <FormLabel className='col-span-2 text-end'>
                            {t('genres.name')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('genres.name_placeholder')}
                              dir={getLanguageDirection(field.lang)}
                              className={Cn(
                                'col-span-4',
                                getLanguageFontClass(field.lang)
                              )}
                              {...nameField}
                            />
                          </FormControl>
                          <FormMessage className='col-span-4 col-start-3' />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                ))}
              </Tabs>

              <DialogFooter>
                <Button type='submit' form='genre-form' disabled={isPending}>
                  {isPending ? <Spinner /> : null} {t('genres.save_changes')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
