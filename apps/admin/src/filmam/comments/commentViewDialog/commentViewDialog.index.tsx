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
import { commentStatusBadge, formatCommentCreatedAt } from '../comments.data'
import type { Comment } from '../comments.type'

type CommentViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Comment
}

export function CommentViewDialog({
  open,
  onOpenChange,
  currentRow,
}: CommentViewDialogProps) {
  const { t } = useTranslation()

  const entityLabel =
    currentRow.entity_type === 'EPISODE'
      ? currentRow.episode_title ?? currentRow.season_title ?? ''
      : currentRow.movie_title ?? ''

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) onOpenChange(false)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <div className='flex items-center justify-between gap-2 pe-8'>
            <DialogTitle>{t('comments.view_comment')}</DialogTitle>
            <Badge
              variant='outline'
              className={commentStatusBadge.get(currentRow.status)}
            >
              {t(`comments.statuses.${currentRow.status}`)}
            </Badge>
          </div>
          <DialogDescription>{t('comments.view_comment_desc')}</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 px-0.5'>
          <div className='flex items-center justify-between gap-2'>
            <div className='min-w-0'>
              <p className='truncate text-sm font-medium'>
                {currentRow.user.username}
              </p>
              <p className='truncate text-xs text-muted-foreground'>
                {currentRow.user.email}
              </p>
            </div>
            {entityLabel && (
              <p className='truncate text-sm text-muted-foreground'>
                {entityLabel}
              </p>
            )}
          </div>
          <div className='rounded-lg border bg-muted/40 p-3'>
            <p className='text-sm whitespace-pre-wrap break-words'>
              {currentRow.body}
            </p>
          </div>
          <div className='flex items-center justify-between gap-2 text-xs text-muted-foreground'>
            <div className='flex items-center gap-3'>
              <span>
                {t('comments.likes_count')}: {currentRow.likes_count}
              </span>
              <span>
                {t('comments.dislikes_count')}: {currentRow.dislikes_count}
              </span>
            </div>
            <span className='text-nowrap'>
              {formatCommentCreatedAt(currentRow.created_at)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}