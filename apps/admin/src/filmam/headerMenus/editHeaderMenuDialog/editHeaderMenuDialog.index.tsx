'use client'

import { z } from 'zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
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
  type HeaderMenuDetailType,
  type HeaderMenusApiResponseType,
  type HeaderMenuItem,
} from '../headerMenus.type'

type HeaderMenuEditDialogProps = {
  currentRow: HeaderMenuItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditHeaderMenuDialog({
  currentRow,
  open,
  onOpenChange,
}: HeaderMenuEditDialogProps) {
  const { t } = useTranslation()

  const {
    data: headerMenuDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['header-menus-detail', currentRow.id],
    queryFn: () =>
      Api<HeaderMenuDetailType>(AppApis.headerMenu.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !headerMenuDetail

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('header_menus.edit_header_menu')}</DialogTitle>
          <DialogDescription>
            {t('header_menus.edit_header_menu_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          {isLoading ? (
            <HeaderMenuDialogSkeleton />
          ) : (
            <HeaderMenuEditForm
              headerMenuDetail={headerMenuDetail}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function HeaderMenuDialogSkeleton() {
  return (
    <div className='space-y-4 px-0.5'>
      <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
        <Skeleton className='col-span-2 ms-auto h-4 w-16' />
        <Skeleton className='col-span-4 h-9 w-full rounded-md' />
      </div>
      <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
        <Skeleton className='col-span-2 ms-auto h-4 w-16' />
        <Skeleton className='col-span-4 h-9 w-full rounded-md' />
      </div>
      <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
        <Skeleton className='col-span-2 ms-auto h-4 w-16' />
        <Skeleton className='col-span-4 h-9 w-full rounded-md' />
      </div>
      <Skeleton className='h-9 w-full rounded-md' />
      <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
        <Skeleton className='col-span-2 ms-auto h-4 w-16' />
        <Skeleton className='col-span-4 h-9 w-full rounded-md' />
      </div>
      <div className='flex justify-end'>
        <Skeleton className='h-9 w-36 rounded-md' />
      </div>
    </div>
  )
}

function HeaderMenuEditForm({
  headerMenuDetail,
  onOpenChange,
}: {
  headerMenuDetail: HeaderMenuDetailType
  onOpenChange: (open: boolean) => void
}) {
  const { t, i18n } = useTranslation()

  const { data: allMenusData } = useQuery({
    queryKey: ['header-menus', 'all-options', i18n.resolvedLanguage],
    queryFn: () =>
      Api<HeaderMenusApiResponseType>(AppApis.headerMenu.adminAll, {
        method: 'GET',
        query: {
          page: 1,
          page_size: 100,
          lang: i18n.resolvedLanguage,
          sort: 'ASC',
        },
      }),
  })
  const menuOptions = allMenusData?.data ?? []

  const formSchema = z
    .object({
      menu_type: z.enum(['PAGE', 'FILTER']),
      href: z.string(),
      order: z
        .string()
        .refine(
          (value) => Number.isFinite(Number(value)) && Number(value) > 0,
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
      menu_type: headerMenuDetail.menu_type,
      href: headerMenuDetail.href ?? '',
      order: String(headerMenuDetail.order),
      parent_id:
        headerMenuDetail.parent_id != null
          ? String(headerMenuDetail.parent_id)
          : 'none',
      translations: headerMenuTabLanguageOrder.map(
        (lang) =>
          ({
            language:
              lang as HeaderMenuForm['translations'][number]['language'],
            title:
              headerMenuDetail.translations.find(
                (translation) => translation.language === lang
              )?.title ?? '',
          }) as HeaderMenuForm['translations'][number]
      ),
      filters: (headerMenuDetail.filters ?? []).map(
        ({ filter_key, filter_value }) => ({ filter_key, filter_value })
      ),
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
      Api(AppApis.headerMenu.adminUpdate(headerMenuDetail.id), {
        method: 'PUT',
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
      toast.success(t('header_menus.header_menu_updated'))
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
    <Form {...form}>
      <form
        id='header-menu-edit-form'
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                  disabled={watchMenuType !== 'PAGE'}
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
                {t('header_menus.order')}
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='col-span-4'>
                    <SelectValue placeholder={t('header_menus.no_parent')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>
                      {t('header_menus.no_parent')}
                    </SelectItem>
                    {menuOptions
                      .filter((menu) => menu.id !== headerMenuDetail.id)
                      .map((menu) => (
                        <SelectItem key={menu.id} value={String(menu.id)}>
                          {menu.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
            form='header-menu-edit-form'
            disabled={isPending}
          >
            {isPending ? <Spinner /> : null} {t('header_menus.save_changes')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
