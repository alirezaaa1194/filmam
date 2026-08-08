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
import { type Season } from '../seasons.type'

type SeasonDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Season
}

export function SeasonsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: SeasonDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.season.adminDelete, {
        method: 'DELETE',
        body: { season_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('seasons.season_deleted'))
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
      form='seasons-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('seasons.delete_season')}
        </span>
      }
      desc={
        <form
          id='seasons-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('seasons.delete_season_desc', { name: currentRow.title })}
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
