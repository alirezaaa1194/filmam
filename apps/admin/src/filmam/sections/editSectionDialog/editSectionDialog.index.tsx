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
import type { SectionDetailType } from '../../../types'
import { SectionDialogSkeleton } from './sectionDialogSkeleton.index'
import { SectionForm } from '../sectionForm/sectionForm'
import { buildSectionFormValuesFromDetail } from '../sectionForm/sectionForm.index'
import type { CreateSectionPayloadType, Section } from '../sections.type'

type EditSectionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Section
}

export function EditSectionDialog({
  open,
  onOpenChange,
  currentRow,
}: EditSectionDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const {
    data: sectionDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['sections-detail', currentRow.id],
    queryFn: () =>
      Api<SectionDetailType>(AppApis.section.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !sectionDetail

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: (payload: CreateSectionPayloadType) =>
      Api(AppApis.section.adminUpdate(currentRow.id), {
        method: 'PUT',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('sections.section_updated'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['sections'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const initialLabels: { movies?: AsyncSelectOption[] } = {
    movies: sectionDetail?.section_movies
      ? sectionDetail.section_movies.map((movie) => ({
          value: String(movie.id),
          label: movie.title,
        }))
      : undefined,
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-full gap-0 p-0 sm:max-w-2xl lg:max-w-3xl'
      >
        <SheetHeader className='pe-10 p-4 sm:p-6'>
          <SheetTitle>{t('sections.edit_section')}</SheetTitle>
          <SheetDescription>{t('sections.edit_section_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            {isLoading || !sectionDetail ? (
              <SectionDialogSkeleton />
            ) : (
              <SectionForm
                formId='section-edit-form'
                defaultValues={buildSectionFormValuesFromDetail(sectionDetail)}
                initialLabels={initialLabels}
                onSubmit={(payload) => mutate(payload)}
              />
            )}
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button
            type='submit'
            form='section-edit-form'
            disabled={isMutating || isLoading}
          >
            {isMutating ? <Spinner /> : null} {t('sections.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
