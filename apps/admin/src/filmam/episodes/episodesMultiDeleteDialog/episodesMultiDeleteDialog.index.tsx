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
import { type Episode } from '../episodes.type'

type EpisodeMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function EpisodesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: EpisodeMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedEpisodes = selectedRows.map((row) => row.original as Episode)
  const selectedCount = selectedEpisodes.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.episode.adminDelete, {
        method: 'DELETE',
        body: {
          episode_ids: selectedEpisodes.map((episode) => episode.id),
        },
      }),
    onSuccess: () => {
      toast.success(t('episodes.episodes_deleted', { count: selectedCount }))
      table.resetRowSelection()
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
      form='episodes-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('episodes.delete_selected')}
        </span>
      }
      desc={
        <form
          id='episodes-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('episodes.multi_delete_desc', { count: selectedCount })}
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
