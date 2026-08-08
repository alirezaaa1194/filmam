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
  countryTabLanguageOrder,
  getLanguageDirection,
  getLanguageFontClass,
} from '../countries.data'
import {
  type CreateCountryPayloadType,
  type Country,
  type CountryDetailType,
} from '../countries.type'
import { CountryDialogSkeleton } from './countryDialogSkeleton.index'

type CountryEditDialogProps = {
  currentRow: Country
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCountryDialog({
  currentRow,
  open,
  onOpenChange,
}: CountryEditDialogProps) {
  const { t } = useTranslation()

  const {
    data: countryDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['countries-detail', currentRow.id],
    queryFn: () =>
      Api<CountryDetailType>(AppApis.country.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !countryDetail

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('countries.edit_country')}</DialogTitle>
          <DialogDescription>
            {t('countries.edit_country_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          {isLoading ? (
            <CountryDialogSkeleton />
          ) : (
            <CountryEditForm
              countryDetail={countryDetail}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CountryEditForm({
  countryDetail,
  onOpenChange,
}: {
  countryDetail: CountryDetailType
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()

  const formSchema = z.object({
    code: z.string().min(1, t('countries.code_required')),
    translations: z.array(
      z.object({
        lang: z.enum(AppLanguagesEnum),
        label: z.string().min(1, t('countries.label_required')),
      })
    ),
  })

  type CountryForm = z.infer<typeof formSchema>

  const form = useForm<CountryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: countryDetail.code,
      translations: countryTabLanguageOrder.map(
        (lang) =>
          ({
            lang: lang as CountryForm['translations'][number]['lang'],
            label:
              countryDetail.translations.find(
                (translation) => translation.language === lang
              )?.label ?? '',
          }) as CountryForm['translations'][number]
      ),
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CountryForm) =>
      Api(AppApis.country.adminUpdate(countryDetail.id), {
        method: 'PUT',
        body: {
          code: data.code,
          translations: data.translations.map(({ lang, label }) => ({
            lang,
            label,
          })),
        } satisfies CreateCountryPayloadType,
      }),
    onSuccess: () => {
      toast.success(t('countries.country_updated'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['countries'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: CountryForm) => {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        id='country-edit-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-0.5'
      >
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                {t('countries.code')}
              </FormLabel>
              <FormControl>
                <Input className='col-span-4' {...field} />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <Tabs defaultValue={countryTabLanguageOrder[0]} className='col-span-6'>
          <TabsList className='w-full'>
            {fields.map((field) => (
              <TabsTrigger key={field.id} value={field.lang} className='flex-1'>
                {t(`countries.languages.${field.lang}`)}
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
                      {t('countries.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('countries.label_placeholder')}
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
          <Button type='submit' form='country-edit-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('countries.save_changes')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
