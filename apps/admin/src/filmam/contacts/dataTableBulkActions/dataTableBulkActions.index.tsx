import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import {
  Button,
  DataTableBulkActions as BulkActionsToolbar,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/utilities/components'
import { CheckCircle2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContactsMultiDeleteDialog } from '../contactsMultiDeleteDialog/contactsMultiDeleteDialog.index'
import { ContactsMultiStatusDialog } from '../contactsMultiStatusDialog/contactsMultiStatusDialog.index'
import { type Contact, type ContactStatusValue } from '../contacts.type'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [statusAction, setStatusAction] =
    useState<ContactStatusValue | null>(null)

  const selectedContacts = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original as Contact)

  const allPending = selectedContacts.every(
    (contact) => contact.status === 'PENDING'
  )

  const canChangeStatus = allPending && selectedContacts.length > 0

  return (
    <>
      <BulkActionsToolbar table={table} entityName='contact'>
        {canChangeStatus && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setStatusAction('ANSWERED')}
                className='size-8 border-emerald-500/50 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10'
                aria-label={t('contacts.approve_selected')}
                title={t('contacts.approve_selected')}
              >
                <CheckCircle2 />
                <span className='sr-only'>
                  {t('contacts.approve_selected')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('contacts.approve_selected')}</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('contacts.delete_selected')}
              title={t('contacts.delete_selected')}
            >
              <Trash2 />
              <span className='sr-only'>{t('contacts.delete_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('contacts.delete_selected')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {statusAction ? (
        <ContactsMultiStatusDialog
          table={table}
          open={statusAction !== null}
          onOpenChange={(open) => {
            if (!open) setStatusAction(null)
          }}
          status={statusAction}
        />
      ) : null}

      <ContactsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}