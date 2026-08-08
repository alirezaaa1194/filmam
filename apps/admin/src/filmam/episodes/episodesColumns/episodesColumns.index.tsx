import { type ColumnDef } from '@tanstack/react-table'
import i18n from '@/i18n'
import { Checkbox, DataTableColumnHeader, LongText } from '@/utilities/components'
import { Cn } from '@/scripts'
import { DataTableRowActions } from '../dataTableRowActions/dataTableRowActions.index'
import { formatEpisodeCreatedAt } from '../episodes.data'
import type { Episode } from '../episodes.type'

export const episodesColumns: ColumnDef<Episode>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('episodes.select_all')}
        className='translate-y-0.5'
      />
    ),
    meta: { className: Cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky') },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={i18n.t('episodes.select_row')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('episodes.title')} />
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
      <DataTableColumnHeader column={column} title={i18n.t('episodes.slug')} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('slug')}</div>
    ),
  },
  {
    accessorKey: 'order',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('episodes.order')} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('order')}</div>
    ),
  },
  {
    accessorKey: 'season_title',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('episodes.season_title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {row.getValue('season_title')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'movie_title',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('episodes.movie_title')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('movie_title')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'likes_count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('episodes.likes_count')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('likes_count')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'dislikes_count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('episodes.dislikes_count')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {row.getValue('dislikes_count')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'watches_count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('episodes.watches_count')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {row.getValue('watches_count')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('episodes.created_at')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatEpisodeCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
