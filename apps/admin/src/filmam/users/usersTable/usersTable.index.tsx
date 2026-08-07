import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Cross2Icon } from '@radix-ui/react-icons'
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
import { useTranslation } from 'react-i18next'
import { Cn } from '@/scripts'
import { useTableUrlState } from '@/hooks'
import type { UserType } from '@/types'
import {
  Button,
  DataTableFacetedFilter,
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

import { isUserBanned, roles } from '../users.data'
import { DataTableBulkActions } from '../dataTableBulkActions/dataTableBulkActions.index'
import { usersColumns as columns } from '../usersColumns/usersColumns.index'
import { UsersTableSkeleton } from '../usersTableSkeleton/usersTableSkeleton.index'

const route = getRouteApi('/_authenticated/users/')

type DataTableProps = {
  data: UserType[]
  isPending: boolean
}

export function UsersTable({ data, isPending }: DataTableProps) {
  const { t } = useTranslation()
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState(search.username ?? '')

  useEffect(() => {
    setSearchInput(search.username ?? '')
  }, [search.username])

  useEffect(() => {
    if (searchInput === search.username) return
    const timeout = setTimeout(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          username: searchInput.trim() || undefined,
          page: undefined,
        }),
      })
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput, search.username, navigate])

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [{ columnId: 'role', searchKey: 'role', type: 'array' }],
  })

  const tableData = useMemo(() => {
    if (search.blocked !== 'unblocked') return data
    return data.filter((user) => !isUserBanned(user.block_expires_at))
  }, [data, search.blocked])

  const pageCount =
    tableData.length < pagination.pageSize ? pagination.pageIndex + 1 : -1

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
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

  const isFiltered =
    columnFilters.length > 0 ||
    !!searchInput.trim() ||
    (search.blocked ?? 'all') !== 'all' ||
    (search.sort ?? 'desc') !== 'desc'

  const resetFilters = () => {
    table.resetColumnFilters()
    setSearchInput('')
    navigate({
      search: (prev) => ({
        ...prev,
        username: undefined,
        blocked: undefined,
        sort: undefined,
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
            placeholder={t('users.filter_placeholder')}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className='h-8 w-37.5 lg:w-62.5'
          />
          <div className='flex gap-x-2'>
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              title={t('users.role')}
              options={roles.map((role) => ({
                label: t(role.labelKey),
                value: role.value,
                icon: role.icon,
              }))}
            />
            <Select
              value={search.blocked ?? 'all'}
              onValueChange={(value) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    blocked:
                      value === 'all'
                        ? undefined
                        : (value as 'blocked' | 'unblocked'),
                    page: undefined,
                  }),
                })
              }}
            >
              <SelectTrigger className='h-8 w-fit gap-1'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent side='bottom'>
                <SelectItem value='all'>{t('users.all_users')}</SelectItem>
                <SelectItem value='blocked'>
                  {t('users.blocked_users')}
                </SelectItem>
                <SelectItem value='unblocked'>
                  {t('users.unblocked_users')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={search.sort ?? 'desc'}
              onValueChange={(value) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    sort: value === 'desc' ? undefined : 'asc',
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
          labels={{
            username: t('users.username'),
            email: t('users.email'),
            role: t('users.role'),
            isBan: t('users.banned'),
          }}
        />
      </div>
      {isPending ? (
        <UsersTableSkeleton />
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
                    No results.
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
