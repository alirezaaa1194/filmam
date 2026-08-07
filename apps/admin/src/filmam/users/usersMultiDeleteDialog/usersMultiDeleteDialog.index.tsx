'use client'

import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Api, TranslateServerError } from '@/scripts'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  ConfirmDialog,
} from '@/utilities/components'

import { type User } from '../users.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppApis } from '../../../data'
import { toast } from 'sonner'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedUsers = selectedRows.map((row) => row.original as User)
  const selectedCount = selectedUsers.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.user.adminDelete, {
        method: 'DELETE',
        body: { users_ids: selectedUsers.map((user) => Number(user.id)) },
      }),
    onSuccess: () => {
      toast.success(t('users.users_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['users'] })
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
      form='users-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('users.delete_selected')}
        </span>
      }
      desc={
        <form
          id='users-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('users.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('users.warning')}</AlertTitle>
            <AlertDescription>
              {t('users.delete_user_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('users.delete_user')}
      destructive
    />
  )
}