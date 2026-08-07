'use client'

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

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.user.adminDelete, {
        method: 'DELETE',
        body: { users_ids: [Number(currentRow.id)] },
      }),
    onSuccess: () => {
      toast.success(t('users.user_deleted'))
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
      form='users-delete-form'
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('users.delete_user')}
        </span>
      }
      desc={
        <form
          id='users-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('users.delete_user_desc', {
              username: currentRow.username,
              role: currentRow.role.toUpperCase(),
            })}
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
