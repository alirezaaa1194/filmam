import { useEffect, useMemo, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { getRouteApi } from '@tanstack/react-router'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Button,
  DataTablePagination,
  DataTableViewOptions,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { Cn } from '@/scripts'
import { useTableUrlState } from '@/hooks'
import { DataTableBulkActions } from '../dataTableBulkActions/dataTableBulkActions.index'
import type { HeaderMenuItem } from '../headerMenus.type'
import { headerMenusColumns as columns } from '../headerMenusColumns/headerMenusColumns.index'
import { HeaderMenusTableSkeleton } from '../headerMenusTableSkeleton/headerMenusTableSkeleton.index'

const route = getRouteApi('/_authenticated/header-menus/')

type DataTableProps = {
  data: HeaderMenuItem[]
  count: number
  isPending: boolean
}

export function HeaderMenusTable({ data, count, isPending }: DataTableProps) {
  const { t } = useTranslation()
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState(search.search ?? '')

  useEffect(() => {
    setSearchInput(search.search ?? '')
  }, [search.search])

  useEffect(() => {
    if (searchInput === search.search) return
    const timeout = setTimeout(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: searchInput.trim() || undefined,
          page: undefined,
        }),
      })
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput, search.search, navigate])

  const { pagination, onPaginationChange } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
  })

  const pageCount = useMemo(
    () =>
      count > 0
        ? Math.max(1, Math.ceil(count / pagination.pageSize))
        : pagination.pageIndex + 1,
    [count, pagination.pageSize, pagination.pageIndex]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const isFiltered = !!searchInput.trim() || (search.sort ?? 'desc') !== 'desc'

  const resetFilters = () => {
    table.resetColumnFilters()
    setSearchInput('')
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        sort: 'desc',
        page: undefined,
      }),
    })
  }

  return (
    <div
      className={Cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <div role='toolbar' className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder={t('header_menus.filter_placeholder')}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className='h-8 w-37.5 lg:w-62.5'
          />
          <div className='flex gap-x-2'>
            <Select
              value={search.sort ?? 'desc'}
              onValueChange={(value) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    sort: value as 'asc' | 'desc',
                    page: undefined,
                  }),
                })
              }}
            >
              <SelectTrigger className='h-8 w-fit gap-1'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent side='bottom'>
                <SelectItem value='desc'>{t('common.desc')}</SelectItem>
                <SelectItem value='asc'>{t('common.asc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isFiltered && (
            <Button
              variant='ghost'
              onClick={resetFilters}
              className='h-8 px-2 lg:px-3'
            >
              {t('common.reset')}
              <Cross2Icon className='ms-2 h-4 w-4' />
            </Button>
          )}
        </div>
        <DataTableViewOptions
          table={table}
          columns={['menu_type', 'parent_id', 'order', 'href', 'created_at']}
          labels={{
            title: t('header_menus.title_column'),
            menu_type: t('header_menus.menu_type'),
            parent_id: t('header_menus.parent_column'),
            order: t('header_menus.order'),
            href: t('header_menus.href'),
            created_at: t('header_menus.created_at'),
          }}
        />
      </div>
      {isPending ? (
        <HeaderMenusTableSkeleton />
      ) : (
        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='group/row'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={Cn(
                          'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                          header.column.columnDef.meta?.className,
                          header.column.columnDef.meta?.thClassName
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className='group/row'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={Cn(
                          'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                          cell.column.columnDef.meta?.className,
                          cell.column.columnDef.meta?.tdClassName
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    {t('common.no_results')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <DataTablePagination table={table} className='mt-auto' />
      <DataTableBulkActions table={table} />
    </div>
  )
}
