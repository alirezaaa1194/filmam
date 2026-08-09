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
import i18n from '@/i18n'
import { AppApis } from '../../../data'
import type { SeasonDetailType } from '../../../types'
import { SeasonDialogSkeleton } from './seasonDialogSkeleton.index'
import { SeasonForm } from '../seasonForm/seasonForm'
import {
  buildSeasonFilesFromDetail,
  buildSeasonFormValuesFromDetail,
} from '../seasonForm/seasonForm.index'
import type { CreateSeasonPayloadType, Season } from '../seasons.type'

type EditSeasonDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Season
}

function getMovieTitleForLanguage(seasonDetail: SeasonDetailType): string {
  const currentLanguage = i18n.resolvedLanguage?.toUpperCase()
  const translation = seasonDetail.movie.translations.find(
    (item) => item.language.toUpperCase() === currentLanguage
  )
  return (
    translation?.title ??
    seasonDetail.movie.translations[0]?.title ??
    String(seasonDetail.movie_id)
  )
}
export function EditSeasonDialog({
  open,
  onOpenChange,
  currentRow,
}: EditSeasonDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const {
    data: seasonDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['seasons-detail', currentRow.id],
    queryFn: () =>
      Api<SeasonDetailType>(AppApis.season.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !seasonDetail

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: (payload: CreateSeasonPayloadType) =>
      Api(AppApis.season.adminUpdate(currentRow.id), {
        method: 'PUT',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('seasons.season_updated'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['seasons'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const initialLabels: { movies?: AsyncSelectOption[] } = {
    movies: seasonDetail
      ? [
          {
            value: String(seasonDetail.movie_id),
            label: getMovieTitleForLanguage(seasonDetail),
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
          <SheetTitle>{t('seasons.edit_season')}</SheetTitle>
          <SheetDescription>{t('seasons.edit_season_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            {isLoading || !seasonDetail ? (
              <SeasonDialogSkeleton />
            ) : (
              <SeasonForm
                formId='season-edit-form'
                defaultValues={buildSeasonFormValuesFromDetail(seasonDetail)}
                defaultFiles={buildSeasonFilesFromDetail(seasonDetail)}
                initialLabels={initialLabels}
                onSubmit={(payload) => mutate(payload)}
              />
            )}
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button
            type='submit'
            form='season-edit-form'
            disabled={isMutating || isLoading}
          >
            {isMutating ? <Spinner /> : null} {t('seasons.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}