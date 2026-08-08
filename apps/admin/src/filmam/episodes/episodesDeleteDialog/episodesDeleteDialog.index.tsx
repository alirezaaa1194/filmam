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
import { type Episode } from '../episodes.type'

type EpisodeDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Episode
}

export function EpisodesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: EpisodeDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.episode.adminDelete, {
        method: 'DELETE',
        body: { episode_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('episodes.episode_deleted'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['episodes'] })
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
      form='episodes-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('episodes.delete_episode')}
        </span>
      }
      desc={
        <form
          id='episodes-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('episodes.delete_episode_desc', { name: currentRow.title })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('episodes.warning')}</AlertTitle>
            <AlertDescription>
              {t('episodes.delete_episode_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('episodes.delete_episode')}
      destructive
    />
  )
}
