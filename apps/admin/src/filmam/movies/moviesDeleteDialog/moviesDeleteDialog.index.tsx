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
import { type Movie } from '../movies.type'

type MovieDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Movie
}

export function MoviesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: MovieDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.movie.adminDelete, {
        method: 'DELETE',
        body: { movie_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('movies.movie_deleted'))
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
      form='movies-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('movies.delete_movie')}
        </span>
      }
      desc={
        <form
          id='movies-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('movies.delete_movie_desc', { title: currentRow.title })}
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
