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
import { type Section } from '../sections.type'

type SectionDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Section
}

export function SectionsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: SectionDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.section.adminDelete, {
        method: 'DELETE',
        body: { sections_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('sections.section_deleted'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['sections'] })
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
      form='sections-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('sections.delete_section')}
        </span>
      }
      desc={
        <form
          id='sections-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('sections.delete_section_desc', { name: currentRow.title })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('sections.warning')}</AlertTitle>
            <AlertDescription>
              {t('sections.delete_section_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('sections.delete_section')}
      destructive
    />
  )
}
