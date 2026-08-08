import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/utilities/components'
import { CheckCircle2, Eye, Trash2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type Contact } from '../contacts.type'
import { useContacts } from '../contactsProvider/contactsProvider.index'

type DataTableRowActionsProps = {
  row: Row<Contact>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useContacts()
  const currentRow = row.original

  const openWithCurrentContact = (dialog: 'answer' | 'reject' | 'view' | 'delete') => {
    setCurrentRow(currentRow)
    setOpen(dialog)
  }

  const canViewMessage =
    currentRow.status === 'ANSWERED' || currentRow.status === 'REJECTED'
  const canAnswer = currentRow.status === 'PENDING'

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>{t('contacts.open_menu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        {canAnswer && (
          <>
            <DropdownMenuItem onClick={() => openWithCurrentContact('answer')}>
              {t('contacts.answer')}
              <DropdownMenuShortcut>
                <CheckCircle2 size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openWithCurrentContact('reject')}>
              {t('contacts.reject')}
              <DropdownMenuShortcut>
                <XCircle size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
        {canViewMessage && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openWithCurrentContact('view')}>
              {t('contacts.view_message')}
              <DropdownMenuShortcut>
                <Eye size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openWithCurrentContact('delete')}
          className='text-red-500!'
        >
          {t('common.delete')}
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
