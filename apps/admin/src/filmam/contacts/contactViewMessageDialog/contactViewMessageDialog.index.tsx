'use client'

import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { Reply, User, XCircle } from 'lucide-react'
import { contactStatusBadge } from '../contacts.data'
import type { Contact } from '../contacts.type'

type ContactViewMessageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Contact
}

export function ContactViewMessageDialog({
  open,
  onOpenChange,
  currentRow,
}: ContactViewMessageDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) onOpenChange(false)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <div className='flex items-center justify-between gap-2 pe-8'>
            <DialogTitle>{t('contacts.view_message')}</DialogTitle>
            <Badge
              variant='outline'
              className={contactStatusBadge.get(currentRow.status)}
            >
              {t(`contacts.statuses.${currentRow.status}`)}
            </Badge>
          </div>
          <DialogDescription>
            {t('contacts.view_message_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3 px-0.5'>
          <div className='rounded-lg border border-sky-200 bg-sky-50/50 p-3 dark:border-sky-900/50 dark:bg-sky-500/10'>
            <div className='mb-2 flex items-center justify-between gap-2'>
              <p className='flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-300'>
                <User className='size-3.5' />
                {t('contacts.user_message')}
              </p>
              <p className='truncate text-xs text-muted-foreground'>
                {currentRow.user_email} (
                {currentRow.is_registered
                  ? t('contacts.registered')
                  : t('contacts.unregistered')}
                )
              </p>
            </div>
            <p className='text-sm break-words whitespace-pre-wrap'>
              {currentRow.message}
            </p>
          </div>

          {currentRow.status === 'ANSWERED' && (
            <div className='rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/50 dark:bg-emerald-500/10'>
              <p className='mb-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300'>
                <Reply className='size-3.5' />
                {t('contacts.answer_message')}
              </p>
              <p className='text-sm break-words whitespace-pre-wrap'>
                {currentRow.answer_message}
              </p>
            </div>
          )}

          {currentRow.status === 'REJECTED' && (
            <div className='rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-900/50 dark:bg-red-500/10'>
              <p className='mb-2 flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300'>
                <XCircle className='size-3.5' />
                {t('contacts.rejected_detail')}
              </p>
              <p className='text-sm break-words whitespace-pre-wrap'>
                {currentRow.rejected_detail}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
