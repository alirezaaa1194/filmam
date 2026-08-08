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
import { type Country } from '../countries.type'

type CountryDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Country
}

export function CountriesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CountryDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.country.adminDelete, {
        method: 'DELETE',
        body: { country_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('countries.country_deleted'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['countries'] })
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
      form='countries-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('countries.delete_country')}
        </span>
      }
      desc={
        <form
          id='countries-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('countries.delete_country_desc', { name: currentRow.label })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('countries.warning')}</AlertTitle>
            <AlertDescription>
              {t('countries.delete_country_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('countries.delete_country')}
      destructive
    />
  )
}
