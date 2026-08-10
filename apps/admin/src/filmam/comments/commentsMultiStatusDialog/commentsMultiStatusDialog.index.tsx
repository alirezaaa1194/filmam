'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { ConfirmDialog } from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import {
  type Comment,
  type CommentStatusValue,
} from '../comments.type'

type CommentsMultiStatusDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
  status: CommentStatusValue
}

export function CommentsMultiStatusDialog<TData>({
  open,
  onOpenChange,
  table,
  status,
}: CommentsMultiStatusDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedComments = selectedRows.map((row) => row.original as Comment)
  const selectedCount = selectedComments.length

  const isApprove = status === 'APPROVED'

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.comment.adminUpdateStatus, {
        method: 'PUT',
        body: {
          comment_ids: selectedComments.map((comment) => comment.id),
          status,
        },
      }),
    onSuccess: () => {
      toast.success(
        isApprove
          ? t('comments.comments_approved', { count: selectedCount })
          : t('comments.comments_rejected', { count: selectedCount })
      )
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['comments'] })
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
      form='comments-multi-status-form'
      title={t(
        isApprove ? 'comments.approve_selected' : 'comments.reject_selected'
      )}
      desc={
        <form
          id='comments-multi-status-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t(
              isApprove
                ? 'comments.multi_approve_desc'
                : 'comments.multi_reject_desc',
              { count: selectedCount }
            )}
          </p>
        </form>
      }
      confirmText={t(isApprove ? 'comments.approve' : 'comments.reject')}
    />
  )
}