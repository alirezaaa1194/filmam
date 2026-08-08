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
import { SeasonForm } from '../seasonForm/seasonForm'
import { buildEmptySeasonFormValues } from '../seasonForm/seasonForm.index'
import type { CreateSeasonPayloadType } from '../seasons.type'

type AddSeasonDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSeasonDialog({ open, onOpenChange }: AddSeasonDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateSeasonPayloadType) =>
      Api(AppApis.season.adminCreate, {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('seasons.season_created'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['seasons'] })
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
          <SheetTitle>{t('seasons.add_season')}</SheetTitle>
          <SheetDescription>{t('seasons.add_season_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            <SeasonForm
              formId='season-add-form'
              defaultValues={buildEmptySeasonFormValues()}
              onSubmit={(payload) => mutate(payload)}
            />
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button type='submit' form='season-add-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('seasons.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}