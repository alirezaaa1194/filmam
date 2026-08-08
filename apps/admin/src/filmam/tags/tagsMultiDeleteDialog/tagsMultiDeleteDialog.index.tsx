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
import { type Tag } from '../tags.type'

type TagMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function TagsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: TagMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedTags = selectedRows.map((row) => row.original as Tag)
  const selectedCount = selectedTags.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.tag.adminDelete, {
        method: 'DELETE',
        body: { tag_ids: selectedTags.map((tag) => tag.id) },
      }),
    onSuccess: () => {
      toast.success(t('tags.tags_deleted', { count: selectedCount }))
      table.resetRowSelection()
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
      form='tags-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('tags.delete_selected')}
        </span>
      }
      desc={
        <form
          id='tags-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('tags.multi_delete_desc', { count: selectedCount })}
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
