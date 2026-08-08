'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Spinner,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import { EpisodeForm } from '../episodeForm/episodeForm'
import { buildEmptyEpisodeFormValues } from '../episodeForm/episodeForm.index'
import type { CreateEpisodePayloadType } from '../episodes.type'

type AddEpisodeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddEpisodeDialog({ open, onOpenChange }: AddEpisodeDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateEpisodePayloadType) =>
      Api(AppApis.episode.adminCreate, {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('episodes.episode_created'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['episodes'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-full gap-0 p-0 sm:max-w-2xl lg:max-w-3xl'
      >
        <SheetHeader className='pe-10 p-4 sm:p-6'>
          <SheetTitle>{t('episodes.add_episode')}</SheetTitle>
          <SheetDescription>{t('episodes.add_episode_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            <EpisodeForm
              formId='episode-add-form'
              defaultValues={buildEmptyEpisodeFormValues()}
              onSubmit={(payload) => mutate(payload)}
            />
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button type='submit' form='episode-add-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('episodes.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}