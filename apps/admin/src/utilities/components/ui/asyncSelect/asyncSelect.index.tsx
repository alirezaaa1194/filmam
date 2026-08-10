'use client'

import * as React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@/utilities/components'
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Cn } from '@/scripts'

export type AsyncSelectOption<T = unknown> = {
  value: string
  label: string
  raw?: T
}

export type AsyncSelectApi<T = unknown> = (params: {
  search: string
  page: number
  pageSize: number
}) => Promise<{
  data: T[]
  page: number
  page_size: number
  count: number
}>

const ROW_HEIGHT = 36
const LIST_PADDING = 8

type AsyncSelectProps<T = unknown> = {
  value: string[]
  onValueChange: (values: string[]) => void
  multiple?: boolean
  api: AsyncSelectApi<T>
  getOptionId: (item: T) => string
  getOptionLabel: (item: T) => string
  queryKey: unknown[]
  initialLabels?: { value: string; label: string }[]
  excludeValues?: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  pageSize?: number
}

export function AsyncSelect<T>({
  value,
  onValueChange,
  multiple = false,
  api,
  getOptionId,
  getOptionLabel,
  queryKey,
  initialLabels,
  excludeValues = [],
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  pageSize = 10,
}: AsyncSelectProps<T>) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const [labelMap, setLabelMap] = React.useState(() => {
    const map = new Map<string, string>()
    initialLabels?.forEach(({ value, label }) => map.set(value, label))
    return map
  })

  const apiRef = React.useRef(api)
  React.useEffect(() => {
    apiRef.current = api
  })
  const gettersRef = React.useRef({ getOptionId, getOptionLabel })
  React.useEffect(() => {
    gettersRef.current = { getOptionId, getOptionLabel }
  })

  React.useEffect(() => {
    if (!open) return
    const timeout = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(timeout)
  }, [search, open])

  const infiniteQuery = useInfiniteQuery({
    queryKey: [...queryKey, i18n.resolvedLanguage, pageSize, debouncedSearch],
    queryFn: ({ pageParam }) =>
      apiRef.current({
        search: debouncedSearch,
        page: pageParam,
        pageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.page_size < lastPage.count
        ? lastPage.page + 1
        : undefined,
    enabled: open,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  const options = (infiniteQuery.data?.pages ?? []).flatMap((page) =>
    page.data.map((item) => ({
      value: getOptionId(item),
      label: getOptionLabel(item),
    }))
  )

  React.useEffect(() => {
    const pages = infiniteQuery.data?.pages
    if (!pages?.length) return
    setLabelMap((prev) => {
      let next = prev
      for (const page of pages) {
        for (const item of page.data) {
          const id = gettersRef.current.getOptionId(item)
          const label = gettersRef.current.getOptionLabel(item)
          if (prev.get(id) !== label) {
            if (next === prev) next = new Map(prev)
            next.set(id, label)
          }
        }
      }
      return next
    })
  }, [infiniteQuery.data])

  const visibleOptions = React.useMemo(
    () => options.filter((option) => !excludeValues.includes(option.value)),
    [options, excludeValues]
  )

  const handleOpenChange = (state: boolean) => {
    setOpen(state)
    if (state) {
      setSearch('')
      setDebouncedSearch('')
    }
  }

  const showSkeleton =
    search !== debouncedSearch ||
    (infiniteQuery.isFetching && !infiniteQuery.isFetchingNextPage)

  const loadMoreRef = React.useRef<() => void>(() => {})
  React.useEffect(() => {
    loadMoreRef.current = () => {
      if (
        infiniteQuery.hasNextPage &&
        !infiniteQuery.isFetchingNextPage &&
        !infiniteQuery.isFetching
      ) {
        void infiniteQuery.fetchNextPage()
      }
    }
  })

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 48) {
      loadMoreRef.current()
    }
  }

  const toggleOption = (optionValue: string) => {
    if (multiple) {
      onValueChange(
        value.includes(optionValue)
          ? value.filter((item) => item !== optionValue)
          : [...value, optionValue]
      )
    } else {
      onValueChange(value.includes(optionValue) ? [] : [optionValue])
      setOpen(false)
    }
  }

  const triggerLabel = value
    .map((item) => labelMap.get(item) ?? item)
    .join(', ')

  const visibleRowCount = Math.min(8, Math.max(2, pageSize - 2))
  const maxListHeight = visibleRowCount * ROW_HEIGHT + LIST_PADDING
  const hasMoreOptions = infiniteQuery.hasNextPage
  const listMaxHeight = hasMoreOptions
    ? Math.max(ROW_HEIGHT + LIST_PADDING, maxListHeight - ROW_HEIGHT * 0.35)
    : undefined

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type='button'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={Cn(
            "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
            !triggerLabel && 'text-muted-foreground',
            className
          )}
        >
          <span className='line-clamp-1 text-start'>
            {triggerLabel || placeholder}
          </span>
          <ChevronsUpDownIcon className='size-4 opacity-50' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-(--radix-popover-trigger-width) p-0'
        onOpenAutoFocus={(event) => event.preventDefault()}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        <div className='overflow-hidden rounded-md bg-popover text-popover-foreground'>
          <div className='flex h-9 items-center gap-2 border-b px-3'>
            <SearchIcon className='size-4 shrink-0 opacity-50' />
            <input
              aria-label={searchPlaceholder ?? t('common.filter')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder ?? t('common.filter')}
              className='flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
          <div
            role='listbox'
            onScroll={handleScroll}
            style={{
              maxHeight: listMaxHeight
                ? `min(${listMaxHeight}px, calc(100dvh - 7rem))`
                : 'calc(100dvh - 7rem)',
            }}
            className='overflow-x-hidden overflow-y-auto p-1'
          >
            {showSkeleton ? (
              <div className='space-y-2 p-2'>
                {Array.from({ length: visibleRowCount }).map((_, index) => (
                  <Skeleton key={index} className='h-8 w-full rounded-md' />
                ))}
              </div>
            ) : visibleOptions.length === 0 ? (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                {emptyMessage ?? t('common.no_results')}
              </div>
            ) : (
              <ul>
                {visibleOptions.map((option) => {
                  const isSelected = value.includes(option.value)
                  return (
                    <li key={option.value}>
                      <button
                        type='button'
                        role='option'
                        aria-selected={isSelected}
                        onClick={() => toggleOption(option.value)}
                        className={Cn(
                          'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                          isSelected && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <CheckIcon
                          className={Cn(
                            'size-4 shrink-0',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className='truncate'>{option.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
            {infiniteQuery.isFetchingNextPage && (
              <div className='space-y-2 p-2' aria-live='polite'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className='h-8 w-full rounded-md' />
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
