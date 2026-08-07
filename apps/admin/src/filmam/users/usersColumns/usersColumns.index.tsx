import i18n from '@/i18n'
import { type ColumnDef } from '@tanstack/react-table'
import { Cn } from '@/scripts'
import {
  Badge,
  Checkbox,
  DataTableColumnHeader,
  LongText,
} from '@/utilities/components'

import { callTypes, formatUserCreatedAt, isUserBanned, roles } from '../users.data'
import { DataTableRowActions } from '../dataTableRowActions/dataTableRowActions.index'
import type { UserType } from '../../../types'

export const usersColumns: ColumnDef<UserType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('users.select_all')}
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: Cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={i18n.t('users.select_row')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('users.username')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('username')}</LongText>
    ),
    meta: {
      className: Cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('users.email')} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('users.created_at')} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatUserCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('users.role')} />
    ),
    cell: ({ row }) => {
      const { role } = row.original
      const userType = roles.find(({ value }) => value === role)

      if (!userType) {
        return null
      }
      const badgeColor = callTypes.get(role)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={Cn('capitalize', badgeColor)}>
            {i18n.t(userType.labelKey)}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'isBan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('users.banned')} />
    ),
    cell: ({ row }) => {
      const isBanned = isUserBanned(row.original.block_expires_at)

      return (
        <div className='flex space-x-2'>
          {isBanned ? i18n.t('users.yes') : i18n.t('users.no')}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
