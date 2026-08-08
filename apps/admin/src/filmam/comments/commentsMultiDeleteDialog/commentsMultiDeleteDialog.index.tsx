'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  ConfirmDialog,
} from '@/utilities/components'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import { type Comment } from '../comments.type'

type CommentMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function CommentsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: CommentMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedComments = selectedRows.map((row) => row.original as Comment)
  const selectedCount = selectedComments.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.comment.adminDelete, {
        method: 'DELETE',
        body: { comment_ids: selectedComments.map((comment) => comment.id) },
      }),
    onSuccess: () => {
      toast.success(t('comments.comments_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['comments'] })
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
      form='comments-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('comments.delete_selected')}
        </span>
      }
      desc={
        <form
          id='comments-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('comments.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('comments.warning')}</AlertTitle>
            <AlertDescription>
              {t('comments.delete_comment_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('comments.delete_comment')}
      destructive
    />
  )
}
