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
import { type Language } from '../languages.type'

type LanguageDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Language
}

export function LanguagesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: LanguageDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.language.adminDelete, {
        method: 'DELETE',
        body: { language_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('languages.language_deleted'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['languages'] })
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
      form='languages-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('languages.delete_language')}
        </span>
      }
      desc={
        <form
          id='languages-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('languages.delete_language_desc', { name: currentRow.label })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('languages.warning')}</AlertTitle>
            <AlertDescription>
              {t('languages.delete_language_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('languages.delete_language')}
      destructive
    />
  )
}
