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
import { type Section } from '../sections.type'

type SectionMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function SectionsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: SectionMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedSections = selectedRows.map((row) => row.original as Section)
  const selectedCount = selectedSections.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.section.adminDelete, {
        method: 'DELETE',
        body: { sections_ids: selectedSections.map((section) => section.id) },
      }),
    onSuccess: () => {
      toast.success(t('sections.sections_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['sections'] })
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
      form='sections-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('sections.delete_selected')}
        </span>
      }
      desc={
        <form
          id='sections-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('sections.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('sections.warning')}</AlertTitle>
            <AlertDescription>
              {t('sections.delete_section_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('sections.delete_section')}
      destructive
    />
  )
}
