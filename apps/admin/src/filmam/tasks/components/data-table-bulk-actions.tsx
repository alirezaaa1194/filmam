import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, CircleArrowUp, ArrowUpDown, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Sleep } from '@/scripts'
import { Button, DataTableBulkActions as BulkActionsToolbar, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Tooltip, TooltipContent, TooltipTrigger } from '@/utilities/components'
import { priorities, statuses } from '../data'
import { type Task } from '../data'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.promise(Sleep(2000), {
      loading: t('tasks.updating_status'),
      success: () => {
        table.resetRowSelection()
        return `Status updated to "${status}" for ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}.`
      },
      error: t('common.error'),
    })
    table.resetRowSelection()
  }

  const handleBulkPriorityChange = (priority: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.promise(Sleep(2000), {
      loading: t('tasks.updating_priority'),
      success: () => {
        table.resetRowSelection()
        return `Priority updated to "${priority}" for ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}.`
      },
      error: t('common.error'),
    })
    table.resetRowSelection()
  }

  const handleBulkExport = () => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.promise(Sleep(2000), {
      loading: t('tasks.exporting_tasks'),
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''} to CSV.`
      },
      error: t('common.error'),
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='task'>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label={t('tasks.update_status')}
                  title={t('tasks.update_status')}
                >
                  <CircleArrowUp />
                  <span className='sr-only'>{t('tasks.update_status')}</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tasks.update_status')}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                defaultValue={status.value}
                onClick={() => handleBulkStatusChange(status.value)}
              >
                {status.icon && (
                  <status.icon className='size-4 text-muted-foreground' />
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label={t('tasks.update_priority')}
                  title={t('tasks.update_priority')}
                >
                  <ArrowUpDown />
                  <span className='sr-only'>{t('tasks.update_priority')}</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tasks.update_priority')}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                defaultValue={priority.value}
                onClick={() => handleBulkPriorityChange(priority.value)}
              >
                {priority.icon && (
                  <priority.icon className='size-4 text-muted-foreground' />
                )}
                {priority.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label={t('tasks.export_tasks')}
              title={t('tasks.export_tasks')}
            >
              <Download />
              <span className='sr-only'>{t('tasks.export_tasks')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('tasks.export_tasks')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('tasks.delete_selected')}
              title={t('tasks.delete_selected')}
            >
              <Trash2 />
              <span className='sr-only'>{t('tasks.delete_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('tasks.delete_selected')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TasksMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
