'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
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

type CountryMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function CountriesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: CountryMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCountries = selectedRows.map((row) => row.original as Country)
  const selectedCount = selectedCountries.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.country.adminDelete, {
        method: 'DELETE',
        body: { country_ids: selectedCountries.map((country) => country.id) },
      }),
    onSuccess: () => {
      toast.success(t('countries.countries_deleted', { count: selectedCount }))
      table.resetRowSelection()
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
      form='countries-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('countries.delete_selected')}
        </span>
      }
      desc={
        <form
          id='countries-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('countries.multi_delete_desc', { count: selectedCount })}
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
