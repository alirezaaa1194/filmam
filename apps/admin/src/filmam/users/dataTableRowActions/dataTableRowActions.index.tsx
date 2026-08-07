import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Ban, KeyRound, Trash2, UserCog, UserPen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/utilities/components'

import { type User } from '../users.type'
import { type UserType } from '../../../types'
import { useUsers } from '../usersProvider/usersProvider.index'

type DataTableRowActionsProps = {
  row: Row<UserType>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow } = useUsers()
  const currentRow = row.original as unknown as User

  const openWithCurrentUser = (
    dialog:
      | 'edit'
      | 'delete'
      | 'change-role'
      | 'change-password'
      | 'block'
  ) => {
    setCurrentRow(currentRow)
    setOpen(dialog)
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>{t('users.open_menu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem onClick={() => openWithCurrentUser('edit')}>
            {t('common.edit')}
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openWithCurrentUser('change-role')}>
            {t('users.change_role')}
            <DropdownMenuShortcut>
              <UserCog size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openWithCurrentUser('change-password')}>
            {t('users.change_password')}
            <DropdownMenuShortcut>
              <KeyRound size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openWithCurrentUser('block')}>
            {t('users.block_user')}
            <DropdownMenuShortcut>
              <Ban size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => openWithCurrentUser('delete')}
            className='text-red-500!'
          >
            {t('common.delete')}
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}