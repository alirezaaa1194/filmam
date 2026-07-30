import { useTranslation } from 'react-i18next'
import { Bell } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
} from '@/utilities/components'
import { useQuery } from '@tanstack/react-query'
import { Api } from '@/scripts'
import { AppApis } from '@/data'
import { NotificationResponse } from '@/types'

export function NotificationDropdown() {
  const { t } = useTranslation()
  const { data, isPending } = useQuery({
    queryKey: ['notification'],
    queryFn: () =>
      Api<NotificationResponse>(AppApis.admin.summary, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  if (!data || isPending) {
    return (
      <Skeleton className='relative size-9 rounded-full'>
        <Skeleton className='absolute -top-1.5 -right-1.5 size-4 rounded-full lg:size-5' />
      </Skeleton>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative size-9 rounded-full'
        >
          <Bell className='size-[1.2rem] transition-all' />
          {data.comments + data.contacts > 0 ? (
            <span className='absolute -top-1.5 -right-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-200 px-0.5 text-[11px] leading-5 font-medium whitespace-nowrap text-amber-900 tabular-nums ring-1 ring-amber-300/60 lg:h-5 lg:min-w-5 lg:px-1.5'>
              {data.comments + data.contacts}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {data?.comments > 0 ? (
          <DropdownMenuItem>
            {t('notifications.dropdown.comments', { count: data.comments })}
          </DropdownMenuItem>
        ) : null}
        {data.contacts ? (
          <DropdownMenuItem>
            {t('notifications.dropdown.contacts', { count: data.contacts })}
          </DropdownMenuItem>
        ) : null}
        {!(data?.comments > 0) && !(data?.contacts > 0) ? (
          <DropdownMenuItem disabled>
            {t('notifications.dropdown.empty')}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
