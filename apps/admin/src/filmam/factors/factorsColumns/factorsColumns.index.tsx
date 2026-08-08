import { type ColumnDef } from '@tanstack/react-table'
import i18n from '@/i18n'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Checkbox,
  DataTableColumnHeader,
  LongText,
} from '@/utilities/components'
import { Cn } from '@/scripts'
import { DataTableRowActions } from '../dataTableRowActions/dataTableRowActions.index'
import { formatFactorCreatedAt } from '../factors.data'
import type { Factor } from '../factors.type'

export const factorsColumns: ColumnDef<Factor>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('factors.select_all')}
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
        aria-label={i18n.t('factors.select_row')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('factors.slug')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('slug')}</LongText>
    ),
    meta: {
      className: Cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('factors.name')} />
    ),
    cell: ({ row }) => {
      const { first_name, last_name, profile } = row.original
      const fullName = `${first_name} ${last_name}`.trim()
      return (
        <div className='flex items-center gap-2.5 ps-2'>
          <Avatar className='size-8 rounded-full'>
            {profile?.path ? (
              <AvatarImage src={profile?.path ?? ''} alt={fullName} />
            ) : null}
            <AvatarFallback className='rounded-full text-xs'>
              {fullName
                ? fullName
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase()
                : '?'}
            </AvatarFallback>
          </Avatar>
          <span className='w-fit text-nowrap'>{fullName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('factors.created_at')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatFactorCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
