import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import {
  Button,
  DataTableBulkActions as BulkActionsToolbar,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/utilities/components'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RolesMultiDeleteDialog } from '../rolesMultiDeleteDialog/rolesMultiDeleteDialog.index'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='role'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('roles.delete_selected')}
              title={t('roles.delete_selected')}
            >
              <Trash2 />
              <span className='sr-only'>{t('roles.delete_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('roles.delete_selected')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <RolesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
