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
import { MovieForm } from '../movieForm/movieForm'
import { buildEmptyMovieFormValues } from '../movieForm/movieForm.index'
import { emptyMovieFilesState, type CreateMoviePayloadType } from '../movies.type'

type AddMovieDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMovieDialog({ open, onOpenChange }: AddMovieDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateMoviePayloadType) =>
      Api(AppApis.movie.adminCreate, {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('movies.movie_created'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['movies'] })
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
          <SheetTitle>{t('movies.add_movie')}</SheetTitle>
          <SheetDescription>{t('movies.add_movie_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            <MovieForm
              formId='movie-add-form'
              defaultValues={buildEmptyMovieFormValues()}
              defaultFiles={emptyMovieFilesState}
              onSubmit={(payload) => mutate(payload)}
            />
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button type='submit' form='movie-add-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('movies.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
