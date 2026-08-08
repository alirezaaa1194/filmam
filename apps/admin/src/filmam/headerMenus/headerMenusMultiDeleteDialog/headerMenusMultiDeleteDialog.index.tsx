'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  ConfirmDialog,
} from '@/utilities/components'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import type { HeaderMenuItem } from '../headerMenus.type'

type HeaderMenuMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function HeaderMenusMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: HeaderMenuMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedMenus = selectedRows.map(
    (row) => row.original as HeaderMenuItem
  )
  const selectedCount = selectedMenus.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.headerMenu.adminDelete, {
        method: 'DELETE',
        body: { menu_ids: selectedMenus.map((menu) => menu.id) },
      }),
    onSuccess: () => {
      toast.success(
        t('header_menus.header_menus_deleted', { count: selectedCount })
      )
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['header-menus'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      isLoading={isPending}
      form='header-menus-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('header_menus.delete_selected')}
        </span>
      }
      desc={
        <form
          id='header-menus-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('header_menus.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('header_menus.warning')}</AlertTitle>
            <AlertDescription>
              {t('header_menus.delete_header_menu_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('header_menus.delete_header_menu')}
      destructive
    />
  )
}
