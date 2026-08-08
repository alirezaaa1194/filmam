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
import { type Movie } from '../movies.type'

type MovieMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function MoviesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: MovieMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedMovies = selectedRows.map((row) => row.original as Movie)
  const selectedCount = selectedMovies.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.movie.adminDelete, {
        method: 'DELETE',
        body: { movie_ids: selectedMovies.map((movie) => movie.id) },
      }),
    onSuccess: () => {
      toast.success(t('movies.movies_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['movies'] })
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
      form='movies-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('movies.delete_selected')}
        </span>
      }
      desc={
        <form
          id='movies-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('movies.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('movies.warning')}</AlertTitle>
            <AlertDescription>
              {t('movies.delete_movie_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('movies.delete_movie')}
      destructive
    />
  )
}
