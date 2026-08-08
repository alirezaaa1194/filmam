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
import { type Genre } from '../genres.type'

type GenreDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Genre
}

export function GenresDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: GenreDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.genre.adminDelete, {
        method: 'DELETE',
        body: { genre_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('genres.genre_deleted'))
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
      form='genres-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('genres.delete_genre')}
        </span>
      }
      desc={
        <form
          id='genres-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('genres.delete_genre_desc', { name: currentRow.name })}
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
