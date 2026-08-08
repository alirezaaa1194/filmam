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
import { type Contact } from '../contacts.type'

type ContactMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function ContactsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: ContactMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedContacts = selectedRows.map((row) => row.original as Contact)
  const selectedCount = selectedContacts.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.contact.adminDelete, {
        method: 'DELETE',
        body: { contact_ids: selectedContacts.map((contact) => contact.id) },
      }),
    onSuccess: () => {
      toast.success(t('contacts.contacts_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['contacts'] })
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
      form='contacts-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('contacts.delete_selected')}
        </span>
      }
      desc={
        <form
          id='contacts-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('contacts.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('contacts.warning')}</AlertTitle>
            <AlertDescription>
              {t('contacts.delete_contact_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('contacts.delete_contact')}
      destructive
    />
  )
}
