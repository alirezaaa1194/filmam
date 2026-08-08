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
import { type Genre } from '../genres.type'

type GenreMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function GenresMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: GenreMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedGenres = selectedRows.map((row) => row.original as Genre)
  const selectedCount = selectedGenres.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.genre.adminDelete, {
        method: 'DELETE',
        body: { genre_ids: selectedGenres.map((genre) => genre.id) },
      }),
    onSuccess: () => {
      toast.success(t('genres.genres_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['genres'] })
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
      form='genres-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('genres.delete_selected')}
        </span>
      }
      desc={
        <form
          id='genres-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('genres.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('genres.warning')}</AlertTitle>
            <AlertDescription>
              {t('genres.delete_genre_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('genres.delete_genre')}
      destructive
    />
  )
}
