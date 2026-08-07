'use client'

import { UserCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Api, TranslateServerError } from '@/scripts'
import { ConfirmDialog } from '@/utilities/components'

import { type User } from '../users.type'
import { getOppositeRole, getRoleLabelKey } from '../users.data'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppApis } from '../../../data'
import { toast } from 'sonner'

type UserChangeRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersChangeRoleDialog({
  open,
  onOpenChange,
  currentRow,
}: UserChangeRoleDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const nextRole = getOppositeRole(currentRow.role)

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      Api(AppApis.user.adminChangeRole(Number(currentRow.id)), {
        method: 'PUT',
      }),
    onSuccess: () => {
      toast.success(t('users.role_changed'))
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
      handleConfirm={mutate}
      title={
        <span>
          <UserCog className='me-1 inline-block' size={18} />{' '}
          {t('users.change_role')}
        </span>
      }
      desc={t('users.change_role_desc', {
        username: currentRow.username,
        role: t(getRoleLabelKey(nextRole)),
      })}
      confirmText={t('users.change_role_action')}
      className='sm:max-w-md'
    />
  )
}