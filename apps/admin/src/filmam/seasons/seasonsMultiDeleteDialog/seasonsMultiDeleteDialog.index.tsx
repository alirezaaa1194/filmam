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
import { type Season } from '../seasons.type'

type SeasonMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function SeasonsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: SeasonMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedSeasons = selectedRows.map((row) => row.original as Season)
  const selectedCount = selectedSeasons.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.season.adminDelete, {
        method: 'DELETE',
        body: { season_ids: selectedSeasons.map((season) => season.id) },
      }),
    onSuccess: () => {
      toast.success(t('seasons.seasons_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['seasons'] })
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
      form='seasons-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('seasons.delete_selected')}
        </span>
      }
      desc={
        <form
          id='seasons-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('seasons.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('seasons.warning')}</AlertTitle>
            <AlertDescription>
              {t('seasons.delete_season_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('seasons.delete_season')}
      destructive
    />
  )
}
