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
import { type Role } from '../roles.type'

type RoleDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Role
}

export function RolesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: RoleDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.role.adminDelete, {
        method: 'DELETE',
        body: { role_ids: [currentRow.id] },
      }),
    onSuccess: () => {
      toast.success(t('roles.role_deleted'))
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
      form='roles-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('roles.delete_role')}
        </span>
      }
      desc={
        <form
          id='roles-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('roles.delete_role_desc', { name: currentRow.name })}
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
