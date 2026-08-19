import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import useDialogState from '@/hooks'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SignOutDialog,
} from '@/utilities/components'
import { BadgeCheck } from 'lucide-react'
import { useUserStore } from '@/stores'
import { HashEmail } from '@/scripts'

export function ProfileDropdown() {
  const { t } = useTranslation()
  const [open, setOpen] = useDialogState()
  const user = useUserStore((s) => s.user)

  if (!user) {
    return null
  }

  const hashedEmail = HashEmail(user.email)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={`https://www.gravatar.com/avatar/${hashedEmail}?d=mp`}
                alt={user.username}
              />
              <AvatarFallback>
                {user.username.split(' ')[0][0].toUpperCase()}{'‌'}
                {user.username.split(' ')[1][0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>
                {user?.username}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className='cursor-pointer gap-2'>
            <Link to='/account' className='font-medium'>
              <BadgeCheck className='size-4 text-muted-foreground' />
              <span className='flex-1'>{t('nav.account')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='destructive'
            onClick={() => setOpen(true)}
            className='cursor-pointer'
          >
            {t('common.sign_out')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
