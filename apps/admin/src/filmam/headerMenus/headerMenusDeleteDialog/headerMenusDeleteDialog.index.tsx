'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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

type HeaderMenuDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: HeaderMenuItem
}

export function HeaderMenusDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: HeaderMenuDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.headerMenu.adminDelete, {
        method: 'DELETE',
        body: { menu_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('header_menus.header_menu_deleted'))
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
      form='header-menus-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('header_menus.delete_header_menu')}
        </span>
      }
      desc={
        <form
          id='header-menus-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('header_menus.delete_header_menu_desc', {
              name: currentRow.title,
            })}
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