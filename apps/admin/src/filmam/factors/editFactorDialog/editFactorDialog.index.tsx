'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import Uploader from '@/utilities/components/uploader/uploader.index'
import { AppApis } from '../../../data'
import { AppLanguagesEnum, type UploadType } from '../../../types'
import {
  factorTabLanguageOrder,
  getLanguageDirection,
  getLanguageFontClass,
} from '../factors.data'
import {
  type CreateFactorPayloadType,
  type Factor,
  type FactorDetailType,
} from '../factors.type'
import { FactorDialogSkeleton } from './factorDialogSkeleton.index'

type FactorEditDialogProps = {
  currentRow: Factor
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFactorDialog({
  currentRow,
  open,
  onOpenChange,
}: FactorEditDialogProps) {
  const { t } = useTranslation()

  const {
    data: factorDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['factors-detail', currentRow.id],
    queryFn: () =>
      Api<FactorDetailType>(AppApis.factor.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !factorDetail

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('factors.edit_factor')}</DialogTitle>
          <DialogDescription>{t('factors.edit_factor_desc')}</DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          {isLoading ? (
            <FactorDialogSkeleton />
          ) : (
            <FactorEditForm
              factorDetail={factorDetail}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FactorEditForm({
  factorDetail,
  onOpenChange,
}: {
  factorDetail: FactorDetailType
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const [profileFiles, setProfileFiles] = useState<UploadType[]>(
    factorDetail.profile ? [factorDetail.profile] : []
  )

  const formSchema = z.object({
    slug: z
      .string()
      .min(1, t('factors.slug_required'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('factors.slug_invalid')),
    translations: z.array(
      z.object({
        lang: z.enum(AppLanguagesEnum),
        first_name: z.string().min(1, t('factors.first_name_required')),
        last_name: z.string().min(1, t('factors.last_name_required')),
      })
    ),
  })

  type FactorForm = z.infer<typeof formSchema>

  const form = useForm<FactorForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: factorDetail.slug,
      translations: factorTabLanguageOrder.map(
        (lang) =>
          ({
            lang: lang as FactorForm['translations'][number]['lang'],
            first_name:
              factorDetail.translations.find(
                (translation) => translation.language === lang
              )?.first_name ?? '',
            last_name:
              factorDetail.translations.find(
                (translation) => translation.language === lang
              )?.last_name ?? '',
          }) as FactorForm['translations'][number]
      ),
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FactorForm) =>
      Api(AppApis.factor.adminUpdate(factorDetail.id), {
        method: 'PUT',
        body: {
          slug: data.slug,
          profile: profileFiles[0]
            ? { upload_id: profileFiles[0].id, upload_type: 'PROFILE' }
            : undefined,
          translations: data.translations.map(
            ({ lang, first_name, last_name }) => ({
              lang,
              first_name,
              last_name,
            })
          ),
        } satisfies CreateFactorPayloadType,
      }),
    onSuccess: () => {
      toast.success(t('factors.factor_updated'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['factors'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: FactorForm) => {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        id='factor-edit-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-0.5'
      >
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                {t('factors.slug')}
              </FormLabel>
              <FormControl>
                <Input className='col-span-4' {...field} />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
          <FormLabel className='col-span-2 text-end'>
            {t('factors.profile')}
          </FormLabel>
          <FormControl>
            <div className='col-span-4'>
              <Uploader
                value={profileFiles}
                onChange={setProfileFiles}
                maxFiles={1}
                fileType='image'
                maxSizeMB={10}
              />
            </div>
          </FormControl>
        </FormItem>

        <Tabs defaultValue={factorTabLanguageOrder[0]} className='col-span-6'>
          <TabsList className='w-full'>
            {fields.map((field) => (
              <TabsTrigger key={field.id} value={field.lang} className='flex-1'>
                {t(`factors.languages.${field.lang}`)}
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
                name={`translations.${index}.first_name`}
                render={({ field: nameField }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('factors.first_name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('factors.first_name_placeholder')}
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
              <FormField
                key={field.id}
                control={form.control}
                name={`translations.${index}.last_name`}
                render={({ field: nameField }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('factors.last_name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('factors.last_name_placeholder')}
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
          <Button type='submit' form='factor-edit-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('factors.save_changes')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
