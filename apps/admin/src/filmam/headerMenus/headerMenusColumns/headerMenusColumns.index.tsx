import { type ColumnDef } from '@tanstack/react-table'
import i18n from '@/i18n'
import {
  Badge,
  Checkbox,
  DataTableColumnHeader,
  LongText,
} from '@/utilities/components'
import { Cn } from '@/scripts'
import { DataTableRowActions } from '../dataTableRowActions/dataTableRowActions.index'
import {
  formatHeaderMenuCreatedAt,
  headerMenuCallTypes,
  headerMenuTypes,
} from '../headerMenus.data'
import type { HeaderMenuItem } from '../headerMenus.type'

export const headerMenusColumns: ColumnDef<HeaderMenuItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('header_menus.select_all')}
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
        aria-label={i18n.t('header_menus.select_row')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('header_menus.title_column')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('title')}</div>
    ),
    meta: {
      className: Cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    accessorKey: 'menu_type',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('header_menus.menu_type')}
      />
    ),
    cell: ({ row }) => {
      const menuType = headerMenuTypes.find(
        ({ value }) => value === row.original.menu_type
      )
      if (!menuType) return null
      const badgeColor = headerMenuCallTypes.get(row.original.menu_type)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={Cn('capitalize', badgeColor)}>
            {i18n.t(menuType.labelKey)}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'order',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('header_menus.order')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('order')}</div>
    ),
  },
  {
    accessorKey: 'href',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('header_menus.href')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 ps-2'>
        {row.getValue('href') ?? '-'}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'parent_id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('header_menus.parent_column')}
      />
    ),
    cell: ({ row, table }) => {
      const parentId = row.original.parent_id
      if (parentId == null) {
        return <div className='ps-2 text-muted-foreground'>-</div>
      }
      const parentTitle = table
        .getRowModel()
        .rows.find((item) => item.original.id === parentId)?.original.title
      return (
        <div className='w-fit ps-2 text-nowrap'>
          {parentTitle ?? `#${parentId}`}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('header_menus.created_at')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatHeaderMenuCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
