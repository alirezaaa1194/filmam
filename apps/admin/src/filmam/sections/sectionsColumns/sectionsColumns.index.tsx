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
  formatSectionCreatedAt,
  sectionSelectionModeBadge,
  sectionViewModeBadge,
} from '../sections.data'
import type { Section } from '../sections.type'

export const sectionsColumns: ColumnDef<Section>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('sections.select_all')}
        className='translate-y-0.5'
      />
    ),
    meta: { className: Cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky') },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={i18n.t('sections.select_row')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('sections.title')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 ps-3'>{row.getValue('title')}</LongText>
    ),
    meta: {
      className: Cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('sections.slug')} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('slug')}</div>
    ),
  },
  {
    accessorKey: 'order',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('sections.order')} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('order')}</div>
    ),
  },
  {
    accessorKey: 'view_mode',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('sections.view_mode')}
      />
    ),
    cell: ({ row }) => {
      const viewMode = row.getValue<string>('view_mode')
      return (
        <Badge variant='outline' className={sectionViewModeBadge.get(viewMode)}>
          {i18n.t(`sections.view_modes.${viewMode}`)}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'selection_mode',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('sections.selection_mode')}
      />
    ),
    cell: ({ row }) => {
      const selectionMode = row.getValue<string>('selection_mode')
      return (
        <Badge
          variant='outline'
          className={sectionSelectionModeBadge.get(selectionMode)}
        >
          {i18n.t(`sections.selection_modes.${selectionMode}`)}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'movies_count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('sections.movies_count')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('movies_count')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('sections.created_at')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatSectionCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
