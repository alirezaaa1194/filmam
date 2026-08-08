'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Spinner,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import { FiltersEditor } from '../filtersEditor/filtersEditor.index'
import {
  type CreateHeaderMenuPayloadType,
  type HeaderMenuDetailType,
  type HeaderMenuFilterItem,
  type HeaderMenusApiResponseType,
} from '../headerMenus.type'

type FiltersManagerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FiltersManagerDrawer({
  open,
  onOpenChange,
}: FiltersManagerProps) {
  const { t, i18n } = useTranslation()
  const [selectedMenuId, setSelectedMenuId] = useState<string>('none')

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
    enabled: open,
  })
  const filterMenus = useMemo(
    () =>
      (allMenusData?.data ?? []).filter((menu) => menu.menu_type === 'FILTER'),
    [allMenusData]
  )

  const selectedMenu = filterMenus.find(
    (menu) => String(menu.id) === selectedMenuId
  )

  const { data: headerMenuDetail, isPending } = useQuery({
    queryKey: ['header-menus-detail', selectedMenuId],
    queryFn: () =>
      Api<HeaderMenuDetailType>(
        AppApis.headerMenu.adminById(Number(selectedMenuId)),
        { method: 'GET' }
      ),
    enabled: open && selectedMenuId !== 'none' && !!selectedMenu,
    staleTime: 0,
  })

  const detail = headerMenuDetail && !isPending ? headerMenuDetail : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader className='text-start'>
          <SheetTitle>{t('header_menus.manage_filters')}</SheetTitle>
          <SheetDescription>
            {t('header_menus.manage_filters_desc')}
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col gap-4 overflow-y-auto px-4'>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium'>
              {t('header_menus.select_menu')}
            </label>
            <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
              <SelectTrigger>
                <SelectValue placeholder={t('header_menus.select_menu')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>
                  {t('header_menus.select_menu')}
                </SelectItem>
                {filterMenus.map((menu) => (
                  <SelectItem key={menu.id} value={String(menu.id)}>
                    {menu.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMenuId !== 'none' &&
            (detail ? (
              <FilterEditorSection key={detail.id} detail={detail} />
            ) : (
              <div className='space-y-3'>
                <Skeleton className='h-9 w-full rounded-md' />
                <Skeleton className='h-9 w-full rounded-md' />
                <Skeleton className='h-9 w-full rounded-md' />
                <Skeleton className='h-9 w-full rounded-md' />
              </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function FilterEditorSection({ detail }: { detail: HeaderMenuDetailType }) {
  const { t, i18n } = useTranslation()
  const queryclient = useQueryClient()

  const [filters, setFilters] = useState<HeaderMenuFilterItem[]>(() =>
    (detail.filters ?? []).map(({ filter_key, filter_value }) => ({
      filter_key,
      filter_value,
    }))
  )

  const { mutate, isPending } = useMutation({
    mutationFn: (data: HeaderMenuDetailType) =>
      Api(AppApis.headerMenu.adminUpdate(data.id), {
        method: 'PUT',
        body: {
          menu_type: data.menu_type,
          href: data.href,
          order: data.order,
          parent_id: data.parent_id ?? undefined,
          translations: data.translations.map(({ language, title }) => ({
            language,
            title,
          })),
          filters,
        } satisfies CreateHeaderMenuPayloadType,
      }),
    onSuccess: () => {
      toast.success(t('header_menus.filters_saved'))
      queryclient.invalidateQueries({ queryKey: ['header-menus'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  return (
    <div className='space-y-3'>
      <div className='space-y-1.5'>
        <label className='text-sm font-medium'>{t('header_menus.title')}</label>
        <div className='rounded-md border bg-muted/40 px-3 py-2 text-sm'>
          {detail.translations.find(
            (translation) => translation.language === i18n.resolvedLanguage
          )?.title ?? '-'}
        </div>
      </div>
      <FiltersEditor filters={filters} onChange={setFilters} />
      <Button
        className='w-full'
        disabled={isPending}
        onClick={() => mutate(detail)}
      >
        {isPending && <Spinner className='me-1' />}
        {t('header_menus.save_filters')}
      </Button>
    </div>
  )
}
