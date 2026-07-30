import { useTranslation } from 'react-i18next'
import { Bell } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/utilities/components'

export function NotificationDropdown() {
  const { t } = useTranslation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative size-9 rounded-full'
        >
          <Bell className='size-[1.2rem] transition-all' />

          <span className='absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] leading-none text-white'>
            12
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>{t('theme.light')} </DropdownMenuItem>
        <DropdownMenuItem>{t('theme.dark')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
