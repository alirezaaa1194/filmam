'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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

type CommentDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Comment
}

export function CommentsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CommentDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.comment.adminDelete, {
        method: 'DELETE',
        body: { comment_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('comments.comment_deleted'))
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
      form='comments-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('comments.delete_comment')}
        </span>
      }
      desc={
        <form
          id='comments-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('comments.delete_comment_desc', { name: currentRow.body })}
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
