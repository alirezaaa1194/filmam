'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Spinner,
  type AsyncSelectOption,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import type { SeasonDetailType } from '../../../types'
import { EpisodeDialogSkeleton } from './episodeDialogSkeleton.index'
import { EpisodeForm } from '../episodeForm/episodeForm'
import {
  buildEpisodeFilesFromDetail,
  buildEpisodeFormValuesFromDetail,
} from '../episodeForm/episodeForm.index'
import type { CreateEpisodePayloadType, Episode, EpisodeDetailType } from '../episodes.type'

type EditEpisodeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Episode
}

export function EditEpisodeDialog({
  open,
  onOpenChange,
  currentRow,
}: EditEpisodeDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const {
    data: episodeDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['episodes-detail', currentRow.id],
    queryFn: () =>
      Api<EpisodeDetailType>(AppApis.episode.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const {
    data: seasonDetail,
  } = useQuery({
    queryKey: ['seasons-detail', episodeDetail?.season_id],
    queryFn: () =>
      Api<SeasonDetailType>(
        AppApis.season.adminById(episodeDetail?.season_id ?? 0),
        { method: 'GET' }
      ),
    enabled: open && !!episodeDetail,
    staleTime: 60_000,
  })

  const isLoading = isPending || isFetching || !episodeDetail

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: (payload: CreateEpisodePayloadType) =>
      Api(AppApis.episode.adminUpdate(currentRow.id), {
        method: 'PUT',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('episodes.episode_updated'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['episodes'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const initialLabels: { movies?: AsyncSelectOption[]; seasons?: AsyncSelectOption[] } = {
    movies: episodeDetail
      ? [
          {
            value: String(episodeDetail.movie_id),
            label: currentRow.movie_title ?? String(episodeDetail.movie_id),
          },
        ]
      : undefined,
    seasons: episodeDetail
      ? [
          {
            value: String(episodeDetail.season_id),
            label:
              seasonDetail?.translations?.[0]?.title ??
              String(episodeDetail.season_id),
          },
        ]
      : undefined,
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-full gap-0 p-0 sm:max-w-2xl lg:max-w-3xl'
      >
        <SheetHeader className='pe-10 p-4 sm:p-6'>
          <SheetTitle>{t('episodes.edit_episode')}</SheetTitle>
          <SheetDescription>{t('episodes.edit_episode_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            {isLoading || !episodeDetail ? (
              <EpisodeDialogSkeleton />
            ) : (
              <EpisodeForm
                formId='episode-edit-form'
                defaultValues={buildEpisodeFormValuesFromDetail(episodeDetail)}
                defaultFiles={buildEpisodeFilesFromDetail(episodeDetail)}
                initialLabels={initialLabels}
                onSubmit={(payload) => mutate(payload)}
              />
            )}
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button
            type='submit'
            form='episode-edit-form'
            disabled={isMutating || isLoading}
          >
            {isMutating ? <Spinner /> : null} {t('episodes.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
