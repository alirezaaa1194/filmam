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
import { type Tag } from '../tags.type'

type TagDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Tag
}

export function TagsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: TagDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.tag.adminDelete, {
        method: 'DELETE',
        body: { tag_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('tags.tag_deleted'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['tags'] })
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
      form='tags-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('tags.delete_tag')}
        </span>
      }
      desc={
        <form
          id='tags-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('tags.delete_tag_desc', { name: currentRow.label })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('tags.warning')}</AlertTitle>
            <AlertDescription>
              {t('tags.delete_tag_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('tags.delete_tag')}
      destructive
    />
  )
}
