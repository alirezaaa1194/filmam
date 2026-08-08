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
import { type Language } from '../languages.type'

type LanguageMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function LanguagesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: LanguageMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedLanguages = selectedRows.map((row) => row.original as Language)
  const selectedCount = selectedLanguages.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.language.adminDelete, {
        method: 'DELETE',
        body: {
          language_ids: selectedLanguages.map((language) => language.id),
        },
      }),
    onSuccess: () => {
      toast.success(t('languages.languages_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['languages'] })
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
      form='languages-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('languages.delete_selected')}
        </span>
      }
      desc={
        <form
          id='languages-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('languages.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('languages.warning')}</AlertTitle>
            <AlertDescription>
              {t('languages.delete_language_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('languages.delete_language')}
      destructive
    />
  )
}
