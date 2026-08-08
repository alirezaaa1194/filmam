'use client'

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
import { AppApis } from '../../../data'
import { AppLanguagesEnum } from '../../../types'
import {
  getLanguageDirection,
  getLanguageFontClass,
  languageTabLanguageOrder,
} from '../languages.data'
import {
  type CreateLanguagePayloadType,
  type Language,
  type LanguageDetailType,
} from '../languages.type'
import { LanguageDialogSkeleton } from './languageDialogSkeleton.index'

type LanguageEditDialogProps = {
  currentRow: Language
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditLanguageDialog({
  currentRow,
  open,
  onOpenChange,
}: LanguageEditDialogProps) {
  const { t } = useTranslation()

  const {
    data: languageDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['languages-detail', currentRow.id],
    queryFn: () =>
      Api<LanguageDetailType>(AppApis.language.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !languageDetail

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('languages.edit_language')}</DialogTitle>
          <DialogDescription>
            {t('languages.edit_language_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          {isLoading ? (
            <LanguageDialogSkeleton />
          ) : (
            <LanguageEditForm
              languageDetail={languageDetail}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LanguageEditForm({
  languageDetail,
  onOpenChange,
}: {
  languageDetail: LanguageDetailType
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()

  const formSchema = z.object({
    code: z.string().min(1, t('languages.code_required')),
    translations: z.array(
      z.object({
        lang: z.enum(AppLanguagesEnum),
        label: z.string().min(1, t('languages.label_required')),
      })
    ),
  })

  type LanguageForm = z.infer<typeof formSchema>

  const form = useForm<LanguageForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: languageDetail.code,
      translations: languageTabLanguageOrder.map(
        (lang) =>
          ({
            lang: lang as LanguageForm['translations'][number]['lang'],
            label:
              languageDetail.translations.find(
                (translation) => translation.lang === lang
              )?.label ?? '',
          }) as LanguageForm['translations'][number]
      ),
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LanguageForm) =>
      Api(AppApis.language.adminUpdate(languageDetail.id), {
        method: 'PUT',
        body: {
          code: data.code,
          translations: data.translations.map(({ lang, label }) => ({
            lang,
            label,
          })),
        } satisfies CreateLanguagePayloadType,
      }),
    onSuccess: () => {
      toast.success(t('languages.language_updated'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['languages'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: LanguageForm) => {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        id='language-edit-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-0.5'
      >
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                {t('languages.code')}
              </FormLabel>
              <FormControl>
                <Input className='col-span-4' {...field} />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <Tabs defaultValue={languageTabLanguageOrder[0]} className='col-span-6'>
          <TabsList className='w-full'>
            {fields.map((field) => (
              <TabsTrigger key={field.id} value={field.lang} className='flex-1'>
                {t(`languages.languages.${field.lang}`)}
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
                name={`translations.${index}.label`}
                render={({ field: labelField }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('languages.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('languages.label_placeholder')}
                        dir={getLanguageDirection(field.lang)}
                        className={Cn(
                          'col-span-4',
                          getLanguageFontClass(field.lang)
                        )}
                        {...labelField}
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
          <Button type='submit' form='language-edit-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('languages.save_changes')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
