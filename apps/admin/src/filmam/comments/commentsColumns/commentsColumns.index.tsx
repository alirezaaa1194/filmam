import { type ColumnDef } from '@tanstack/react-table'
import i18n from '@/i18n'
import { Badge, Checkbox, DataTableColumnHeader, LongText } from '@/utilities/components'
import { Cn } from '@/scripts'
import { CommentBodyCell } from '../commentBodyCell/commentBodyCell.index'
import { DataTableRowActions } from '../dataTableRowActions/dataTableRowActions.index'
import { commentStatusBadge, formatCommentCreatedAt } from '../comments.data'
import type { Comment } from '../comments.type'

export const commentsColumns: ColumnDef<Comment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('comments.select_all')}
        className='translate-y-0.5'
      />
    ),
    meta: { className: Cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky') },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={i18n.t('comments.select_row')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'body',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('comments.body')} />
    ),
    cell: ({ row }) => <CommentBodyCell row={row} />,
    meta: {
      className: Cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('comments.user')} />
    ),
    cell: ({ row }) => {
      const user = row.getValue<Comment['user']>('user')
      return (
        <div className='w-fit ps-2'>
          <div className='text-nowrap'>{user.username}</div>
          <div className='text-xs text-muted-foreground'>{user.email}</div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'entity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('comments.entity')} />
    ),
    cell: ({ row }) => {
      const comment = row.original
      const label =
        comment.entity_type === 'EPISODE'
          ? comment.episode_title ?? comment.season_title ?? ''
          : comment.movie_title ?? ''
      return <LongText className='max-w-40 ps-2'>{label}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('comments.status')} />
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      return (
        <Badge variant='outline' className={commentStatusBadge.get(status)}>
          {i18n.t(`comments.statuses.${status}`)}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'likes_count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('comments.likes_count')}
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
        title={i18n.t('comments.dislikes_count')}
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
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('comments.created_at')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatCommentCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
