import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Ban, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, DataTableBulkActions as BulkActionsToolbar, Tooltip, TooltipContent, TooltipTrigger } from '@/utilities/components'
import { type User } from '../users.type'
import { UsersBlockDialog } from '../usersBlockDialog/usersBlockDialog.index'
import { UsersMultiDeleteDialog } from '../usersMultiDeleteDialog/usersMultiDeleteDialog.index'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBlock, setShowBlock] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedUsers = selectedRows.map((row) => row.original as User)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setShowBlock(true)}
              className='size-8'
              aria-label={t('users.ban_selected')}
              title={t('users.ban_selected')}
            >
              <Ban />
              <span className='sr-only'>{t('users.ban_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.ban_selected')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('users.delete_selected')}
              title={t('users.delete_selected')}
            >
              <Trash2 />
              <span className='sr-only'>{t('users.delete_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.delete_selected')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersBlockDialog
        users={selectedUsers}
        open={showBlock}
        onOpenChange={setShowBlock}
      />

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}