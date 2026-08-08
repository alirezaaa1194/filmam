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
import { SectionForm } from '../sectionForm/sectionForm'
import { buildEmptySectionFormValues } from '../sectionForm/sectionForm.index'
import type { CreateSectionPayloadType } from '../sections.type'

type AddSectionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSectionDialog({ open, onOpenChange }: AddSectionDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateSectionPayloadType) =>
      Api(AppApis.section.adminCreate, {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => {
      toast.success(t('sections.section_created'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['sections'] })
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
          <SheetTitle>{t('sections.add_section')}</SheetTitle>
          <SheetDescription>{t('sections.add_section_desc')}</SheetDescription>
        </SheetHeader>

        {open && (
          <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-6'>
            <SectionForm
              formId='section-add-form'
              defaultValues={buildEmptySectionFormValues()}
              onSubmit={(payload) => mutate(payload)}
            />
          </div>
        )}

        <SheetFooter className='border-t px-4 py-4 sm:px-6'>
          <Button type='submit' form='section-add-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('sections.save_changes')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}