import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
  labels?: Record<string, string>
  columns?: string[]
}

export function DataTableViewOptions<TData>({
  table,
  labels,
  columns,
}: DataTableViewOptionsProps<TData>) {
  const { t } = useTranslation()

  const toggleableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' &&
        column.getCanHide() &&
        (columns ?? ['created_at', 'isBan', 'role']).includes(column.id)
    )

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='ms-auto hidden h-8 lg:flex'
        >
          <MixerHorizontalIcon className='size-4' />
          {t('common.view')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-37.5'>
        <DropdownMenuLabel>{t('common.toggle_columns')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {toggleableColumns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className='capitalize'
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {labels?.[column.id] ?? column.id}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
