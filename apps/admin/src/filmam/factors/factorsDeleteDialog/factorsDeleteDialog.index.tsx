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
import { type Factor } from '../factors.type'

type FactorDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Factor
}

export function FactorsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: FactorDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.factor.adminDelete, {
        method: 'DELETE',
        body: { factor_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('factors.factor_deleted'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['factors'] })
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
      form='factors-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('factors.delete_factor')}
        </span>
      }
      desc={
        <form
          id='factors-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('factors.delete_factor_desc', {
              name: `${currentRow.first_name} ${currentRow.last_name}`.trim(),
            })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('factors.warning')}</AlertTitle>
            <AlertDescription>
              {t('factors.delete_factor_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('factors.delete_factor')}
      destructive
    />
  )
}
