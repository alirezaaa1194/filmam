import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import {
  Button,
  DataTableBulkActions as BulkActionsToolbar,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/utilities/components'
import { CheckCircle2, Trash2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CommentsMultiDeleteDialog } from '../commentsMultiDeleteDialog/commentsMultiDeleteDialog.index'
import { CommentsMultiStatusDialog } from '../commentsMultiStatusDialog/commentsMultiStatusDialog.index'
import { type Comment, type CommentStatusValue } from '../comments.type'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [statusAction, setStatusAction] =
    useState<CommentStatusValue | null>(null)

  const selectedComments = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original as Comment)

  const canApprove = selectedComments.some(
    (comment) => comment.status !== 'APPROVED'
  )
  const canReject = selectedComments.some(
    (comment) => comment.status !== 'REJECTED'
  )

  return (
    <>
      <BulkActionsToolbar table={table} entityName='comment'>
        {canApprove && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setStatusAction('APPROVED')}
                className='size-8 border-emerald-500/50 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10'
                aria-label={t('comments.approve_selected')}
                title={t('comments.approve_selected')}
              >
                <CheckCircle2 />
                <span className='sr-only'>
                  {t('comments.approve_selected')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('comments.approve_selected')}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {canReject && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setStatusAction('REJECTED')}
                className='size-8 border-red-500/50 text-red-600 hover:text-red-600 hover:bg-red-500/10'
                aria-label={t('comments.reject_selected')}
                title={t('comments.reject_selected')}
              >
                <XCircle />
                <span className='sr-only'>
                  {t('comments.reject_selected')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('comments.reject_selected')}</p>
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
              aria-label={t('comments.delete_selected')}
              title={t('comments.delete_selected')}
            >
              <Trash2 />
              <span className='sr-only'>{t('comments.delete_selected')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('comments.delete_selected')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {statusAction ? (
        <CommentsMultiStatusDialog
          table={table}
          open={statusAction !== null}
          onOpenChange={(open) => {
            if (!open) setStatusAction(null)
          }}
          status={statusAction}
        />
      ) : null}

      <CommentsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}