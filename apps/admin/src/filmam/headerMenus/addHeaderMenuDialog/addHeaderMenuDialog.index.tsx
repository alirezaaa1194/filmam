'use client'

import { z } from 'zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AsyncSelect,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { FiltersEditor } from '../filtersEditor/filtersEditor.index'
import {
  getLanguageDirection,
  getLanguageFontClass,
  headerMenuTabLanguageOrder,
  headerMenuTypes,
} from '../headerMenus.data'
import {
  sectionFilterKeySchema,
  type CreateHeaderMenuPayloadType,
  type HeaderMenusApiResponseType,
} from '../headerMenus.type'

type HeaderMenuAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddHeaderMenuDialog({
  open,
  onOpenChange,
}: HeaderMenuAddDialogProps) {
  const { t, i18n } = useTranslation()

  const formSchema = z
    .object({
      menu_type: z.enum(['PAGE', 'FILTER']),
      href: z.string(),
      order: z
        .string()
        .refine(
          (value) => Number.isFinite(Number(value)) && Number(value) >= 1,
          { message: t('header_menus.order_required') }
        ),
      parent_id: z.string().optional(),
      translations: z.array(
        z.object({
          language: z.enum(AppLanguagesEnum),
          title: z.string().min(1, t('header_menus.title_required')),
        })
      ),
      filters: z.array(
        z.object({
          filter_key: sectionFilterKeySchema,
          filter_value: z
            .string()
            .min(1, t('header_menus.filter_value_required')),
        })
      ),
    })
    .superRefine((data, ctx) => {
      if (data.menu_type === 'PAGE') {
        if (!data.href.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['href'],
            message: t('header_menus.href_required'),
          })
        }
      } else if (data.filters.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['filters'],
          message: t('header_menus.filters_required'),
        })
      }
    })

  type HeaderMenuForm = z.infer<typeof formSchema>

  const form = useForm<HeaderMenuForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menu_type: 'PAGE',
      href: '',
      order: '1',
      parent_id: 'none',
      translations: headerMenuTabLanguageOrder.map(
        (lang) =>
          ({
            language:
              lang as HeaderMenuForm['translations'][number]['language'],
            title: '',
          }) as HeaderMenuForm['translations'][number]
      ),
      filters: [],
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const queryclient = useQueryClient()
  const watchMenuType = useWatch({
    control: form.control,
    name: 'menu_type',
  })
  const watchFilters = useWatch({
    control: form.control,
    name: 'filters',
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: HeaderMenuForm) =>
      Api(AppApis.headerMenu.adminCreate, {
        method: 'POST',
        body: {
          menu_type: data.menu_type,
          href: data.href.trim() || undefined,
          order: Number(data.order),
          parent_id:
            data.parent_id && data.parent_id !== 'none'
              ? Number(data.parent_id)
              : undefined,
          translations: data.translations.map(({ language, title }) => ({
            language,
            title,
          })),
          filters:
            data.menu_type === 'FILTER'
              ? data.filters.map(({ filter_key, filter_value }) => ({
                  filter_key,
                  filter_value,
                }))
              : [],
        } satisfies CreateHeaderMenuPayloadType,
      }),
    onSuccess: () => {
      toast.success(t('header_menus.header_menu_created'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['header-menus'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: HeaderMenuForm) => {
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
      <DialogContent className='max-h-[calc(100dvh-3rem)] overflow-hidden sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('header_menus.add_header_menu')}</DialogTitle>
          <DialogDescription>
            {t('header_menus.add_header_menu_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className='min-h-0 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='header-menu-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='menu_type'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('header_menus.menu_type')}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='col-span-4'>
                          <SelectValue
                            placeholder={t('header_menus.select_menu_type')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {headerMenuTypes.map(({ labelKey, value }) => (
                            <SelectItem key={value} value={value}>
                              {t(labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {watchMenuType === 'PAGE' && (
              <FormField
                control={form.control}
                name='href'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('header_menus.href')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('header_menus.href_placeholder')}
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            )}

              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('header_menus.order')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='1'
                        placeholder='1'
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
                name='parent_id'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('header_menus.parent_menu')}
                    </FormLabel>
                    <FormControl>
                      <AsyncSelect
                        className='col-span-4'
                        queryKey={[
                          'header-menus',
                          'parent-options',
                          i18n.resolvedLanguage,
                        ]}
                        api={(params) =>
                          Api<HeaderMenusApiResponseType>(
                            AppApis.headerMenu.adminAll,
                            {
                              method: 'GET',
                              query: {
                                page: params.page,
                                page_size: params.pageSize,
                                search: params.search || undefined,
                                sort: 'ASC',
                              },
                            }
                          )
                        }
                        getOptionId={(menu) => String(menu.id)}
                        getOptionLabel={(menu) => menu.title}
                        value={
                          field.value && field.value !== 'none'
                            ? [field.value]
                            : []
                        }
                        onValueChange={(values) =>
                          field.onChange(values[0] ?? 'none')
                        }
                        placeholder={t('header_menus.no_parent')}
                        searchPlaceholder={t('header_menus.search_parent_menu')}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {watchMenuType === 'FILTER' && (
                <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 pt-1.5 text-end'>
                    {t('header_menus.filters')}
                  </FormLabel>
                  <div className='col-span-4 space-y-1'>
                    <FiltersEditor
                      filters={watchFilters}
                      onChange={(filters) => form.setValue('filters', filters)}
                    />
                    {form.formState.errors.filters && (
                      <p className='text-sm font-medium text-destructive'>
                        {form.formState.errors.filters.message}
                      </p>
                    )}
                  </div>
                </FormItem>
              )}

              <Tabs
                defaultValue={headerMenuTabLanguageOrder[0]}
                className='col-span-6'
              >
                <TabsList className='w-full'>
                  {fields.map((field) => (
                    <TabsTrigger
                      key={field.id}
                      value={field.language}
                      className='flex-1'
                    >
                      {t(`header_menus.languages.${field.language}`)}
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
                      key={field.id}
                      control={form.control}
                      name={`translations.${index}.title`}
                      render={({ field: titleField }) => (
                        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                          <FormLabel className='col-span-2 text-end'>
                            {t('header_menus.title')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('header_menus.title_placeholder')}
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
                  </TabsContent>
                ))}
              </Tabs>

              <DialogFooter>
                <Button
                  type='submit'
                  form='header-menu-form'
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : null}{' '}
                  {t('header_menus.save_changes')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
