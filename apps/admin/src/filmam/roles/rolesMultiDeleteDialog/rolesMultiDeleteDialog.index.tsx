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
import { type Role } from '../roles.type'

type RoleMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function RolesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: RoleMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedRoles = selectedRows.map((row) => row.original as Role)
  const selectedCount = selectedRoles.length

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.role.adminDelete, {
        method: 'DELETE',
        body: { role_ids: selectedRoles.map((role) => role.id) },
      }),
    onSuccess: () => {
      toast.success(t('roles.roles_deleted', { count: selectedCount }))
      table.resetRowSelection()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['roles'] })
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
      form='roles-multi-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('roles.delete_selected')}
        </span>
      }
      desc={
        <form
          id='roles-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('roles.multi_delete_desc', { count: selectedCount })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('roles.warning')}</AlertTitle>
            <AlertDescription>
              {t('roles.delete_role_confirmation')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('roles.delete_role')}
      destructive
    />
  )
}
