'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import {
  ConfirmDialog,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import { type Contact, type ContactStatusValue } from '../contacts.type'

type ContactsMultiStatusDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
  status: ContactStatusValue
}

export function ContactsMultiStatusDialog<TData>({
  open,
  onOpenChange,
  table,
  status,
}: ContactsMultiStatusDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedContacts = selectedRows.map((row) => row.original as Contact)
  const selectedCount = selectedContacts.length

  const isApprove = status === 'ANSWERED'
  const messageLabel = isApprove
    ? t('contacts.answer_message')
    : t('contacts.rejected_detail')
  const messagePlaceholder = isApprove
    ? t('contacts.answer_message_placeholder')
    : t('contacts.rejected_detail_placeholder')

  const form = useForm<{ message: string }>({
    resolver: zodResolver(
      z.object({
        message: z.string().min(1, t('contacts.message_required')),
      })
    ),
    defaultValues: { message: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: { message: string }) =>
      Api(AppApis.contact.adminUpdateStatus, {
        method: 'PUT',
        body: {
          contact_ids: selectedContacts.map((contact) => contact.id),
          status,
          ...(isApprove
            ? { answer_message: values.message }
            : { rejected_detail: values.message }),
        },
      }),
    onSuccess: () => {
      toast.success(
        isApprove
          ? t('contacts.contacts_answered', { count: selectedCount })
          : t('contacts.contacts_rejected', { count: selectedCount })
      )
      table.resetRowSelection()
      onOpenChange(false)
      form.reset()
      queryclient.invalidateQueries({ queryKey: ['contacts'] })
      queryclient.invalidateQueries({ queryKey: ['notification'] })
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
      form='contacts-multi-status-form'
      title={t(
        isApprove ? 'contacts.approve_selected' : 'contacts.reject_selected'
      )}
      desc={
        <form
          id='contacts-multi-status-form'
          onSubmit={form.handleSubmit((values) => mutate(values))}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t(
              isApprove
                ? 'contacts.multi_approve_desc'
                : 'contacts.multi_reject_desc',
              { count: selectedCount }
            )}
          </p>
          <Form {...form}>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 pt-1.5 text-end'>
                    {messageLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={messagePlaceholder}
                      className='col-span-4 resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
          </Form>
        </form>
      }
      confirmText={t(isApprove ? 'contacts.answer' : 'contacts.reject')}
    />
  )
}