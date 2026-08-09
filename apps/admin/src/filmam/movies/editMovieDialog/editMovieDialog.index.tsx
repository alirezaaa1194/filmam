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
import { MovieDialogSkeleton } from '../movieDialogSkeleton/movieDialogSkeleton.index'
import { MovieForm } from '../movieForm/movieForm'
import {
  buildMovieFilesFromDetail,
  buildMovieFormValuesFromDetail,
} from '../movieForm/movieForm.index'
import { movieGenreLabel, movieTagLabel } from '../movies.data'
import type {
  CreateMoviePayloadType,
  Movie,
  MovieDetailType,
} from '../movies.type'

type EditMovieDialogProps = {
  currentRow: Movie
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMovieDialog({
  currentRow,
  open,
  onOpenChange,
}: EditMovieDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const {
    data: movieDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['movies-detail', currentRow.id],
    queryFn: () =>
      Api<MovieDetailType>(AppApis.movie.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !movieDetail

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: (payload: CreateMoviePayloadType) =>
      Api(AppApis.movie.adminUpdate(currentRow.id), {
        method: 'PUT',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('movies.movie_updated'))
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
          <SheetTitle>{t('movies.edit_movie')}</SheetTitle>
          <SheetDescription>{t('movies.edit_movie_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            {isLoading || !movieDetail ? (
              <MovieDialogSkeleton />
            ) : (
              <MovieForm
                formId='movie-edit-form'
                defaultValues={buildMovieFormValuesFromDetail(movieDetail)}
                defaultFiles={buildMovieFilesFromDetail(movieDetail)}
                initialLabels={{
                  genres: movieDetail.genres.map((genre) => ({
                    value: String(genre.id),
                    label: movieGenreLabel(movieDetail.genres, genre.id),
                  })),
                  tags: movieDetail.tags.map((tag) => ({
                    value: String(tag.id),
                    label: movieTagLabel(movieDetail.tags, tag.id),
                  })),
                  countries: movieDetail.countries?.map((country) => ({
                    value: String(country.id),
                    label: country.label,
                  })),
                  languages: movieDetail.languages?.map((language) => ({
                    value: String(language.id),
                    label: language.label,
                  })),
                  factors: movieDetail.factors.map((factor) => ({
                    value: String(factor.id),
                    label: `${factor.first_name} ${factor.last_name}`.trim(),
                  })),
                  roles: movieDetail.factors.map((factor) => ({
                    value: String(factor.role.id),
                    label: factor.role.name,
                  })) as AsyncSelectOption[] | undefined,
                }}
                onSubmit={(payload) => mutate(payload)}
              />
            )}
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button
            type='submit'
            form='movie-edit-form'
            disabled={isMutating || isLoading}
          >
            {isMutating ? <Spinner /> : null} {t('movies.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
