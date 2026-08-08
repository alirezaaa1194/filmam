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
import { formatMovieCreatedAt } from '../movies.data'
import type { Movie } from '../movies.type'

const movieCallTypes = new Map<string, string>([
  [
    'CINEMATIC',
    'bg-violet-100/60 text-violet-900 border-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500',
  ],
  [
    'SERIES',
    'bg-neutral-200/60 text-neutral-800 border-neutral-300 dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-neutral-600',
  ],
])

export const moviesColumns: ColumnDef<Movie>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18n.t('movies.select_all')}
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
        aria-label={i18n.t('movies.select_row')}
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
        title={i18n.t('movies.title_column')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>{row.getValue('title')}</LongText>
    ),
    meta: {
      className: Cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('movies.slug')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-2'>{row.getValue('slug')}</LongText>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('movies.type')} />
    ),
    cell: ({ row }) => {
      const { type } = row.original
      const badgeColor = movieCallTypes.get(type)
      return (
        <div className='flex ps-2'>
          <Badge variant='outline' className={Cn('capitalize', badgeColor)}>
            {i18n.t(`movies.type_${type.toLowerCase()}`)}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'released_year',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('movies.released_year')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('released_year')}</div>
    ),
  },
  {
    accessorKey: 'age_limit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('movies.age_limit')} />
    ),
    cell: ({ row }) => {
      const ageLimit = row.getValue<number | undefined>('age_limit')
      return (
        <div className='flex ps-2'>
          {ageLimit != null ? (
            <Badge variant='outline' className='text-nowrap'>
              {ageLimit}+
            </Badge>
          ) : (
            <span className='text-muted-foreground'>—</span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'likes_count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('movies.likes_count')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap tabular-nums'>
        {row.getValue('likes_count')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'dislikes_count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('movies.dislikes_count')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap tabular-nums'>
        {row.getValue('dislikes_count')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'genres',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t('movies.genres')} />
    ),
    cell: ({ row }) => {
      const genres = row.getValue<Movie['genres']>('genres') ?? []
      return (
        <div className='flex max-w-48 flex-wrap gap-1 ps-2'>
          {genres.slice(0, 2).map((genre) => (
            <Badge key={genre.id} variant='secondary' className='max-w-full'>
              <span className='truncate'>{genre.name}</span>
            </Badge>
          ))}
          {genres.length > 2 && (
            <Badge variant='outline'>+{genres.length - 2}</Badge>
          )}
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
        title={i18n.t('movies.created_at')}
      />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>
        {formatMovieCreatedAt(row.getValue('created_at'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
