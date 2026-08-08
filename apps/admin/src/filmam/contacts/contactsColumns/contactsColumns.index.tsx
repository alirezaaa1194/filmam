import { type ColumnDef } from '@tanstack/react-table'
import i18n from '@/i18n'
import { Badge, Checkbox, DataTableColumnHeader, LongText } from '@/utilities/components'
import { Cn } from '@/scripts'
import { DataTableRowActions } from '../dataTableRowActions/dataTableRowActions.index'
import { contactStatusBadge, formatContactCreatedAt } from '../contacts.data'
import type { Contact } from '../contacts.type'

export const contactsColumns: ColumnDef<Contact>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('contacts.select_all')}
        className='translate-y-0.5'
      />
    ),
    meta: { className: Cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky') },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={i18n.t('contacts.select_row')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user_email',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('contacts.user_email')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 ps-3'>{row.getValue('user_email')}</LongText>
    ),
    meta: {
      className: Cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    accessorKey: 'message',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('contacts.message')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-52 ps-2'>{row.getValue('message')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'is_registered',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('contacts.is_registered')}
      />
    ),
    cell: ({ row }) => {
      const isRegistered = row.getValue<boolean>('is_registered')
      return (
        <Badge
          variant='outline'
          className={
            isRegistered
              ? 'bg-emerald-100/60 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500'
              : 'bg-neutral-200/60 text-neutral-800 border-neutral-300 dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-neutral-600'
          }
        >
          {isRegistered
            ? i18n.t('contacts.registered')
            : i18n.t('contacts.unregistered')}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('contacts.status')} />
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      return (
        <Badge variant='outline' className={contactStatusBadge.get(status)}>
          {i18n.t(`contacts.statuses.${status}`)}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('contacts.created_at')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatContactCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
