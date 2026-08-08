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
import { type Contact } from '../contacts.type'

type ContactDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Contact
}

export function ContactsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ContactDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.contact.adminDelete, {
        method: 'DELETE',
        body: { contact_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('contacts.contact_deleted'))
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
      form='contacts-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('contacts.delete_contact')}
        </span>
      }
      desc={
        <form
          id='contacts-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('contacts.delete_contact_desc', { name: currentRow.user_email })}
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
