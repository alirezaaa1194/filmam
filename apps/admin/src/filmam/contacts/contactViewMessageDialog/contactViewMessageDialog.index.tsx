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

  const isAnswered = currentRow.status === 'ANSWERED'

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) onOpenChange(false)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <div className='flex items-center justify-between gap-2'>
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
        <div className='space-y-4 px-0.5'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>{currentRow.user_email}</p>
            <p className='text-sm text-muted-foreground'>{currentRow.message}</p>
          </div>
          <div className='rounded-lg border bg-muted/40 p-3'>
            <p className='mb-1 text-xs font-medium text-muted-foreground'>
              {isAnswered
                ? t('contacts.answer_message')
                : t('contacts.rejected_detail')}
            </p>
            <p className='text-sm'>
              {isAnswered
                ? currentRow.answer_message
                : currentRow.rejected_detail}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
