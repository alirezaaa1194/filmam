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
import { type Factor } from '../factors.type'

type FactorMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function FactorsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: FactorMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedFactors = selectedRows.map((row) => row.original as Factor)
  const selectedCount = selectedFactors.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.factor.adminDelete, {
        method: 'DELETE',
        body: { factor_ids: selectedFactors.map((factor) => factor.id) },
      }),
    onSuccess: () => {
      toast.success(t('factors.factors_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['factors'] })
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
      form='factors-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('factors.delete_selected')}
        </span>
      }
      desc={
        <form
          id='factors-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('factors.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('factors.warning')}</AlertTitle>
            <AlertDescription>
              {t('factors.delete_factor_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('factors.delete_factor')}
      destructive
    />
  )
}
