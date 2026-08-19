import { Avatar, AvatarFallback, AvatarImage } from '@/utilities/components'
import { type UserType } from '@/types'
import { HashEmail } from '@/scripts'
export function RecentUsers({ data }: { data: UserType[] }) {
  return (
    <div className='space-y-8'>
      {data.map((user) => {
        const hashedEmail = HashEmail(user.email)
        const initials = user.username
          .split(/\s+/)
          .filter(Boolean)
          .map((part) => part[0])
          .join('‌')
          .slice(0, 2)
          .toUpperCase()
        return (
          <div key={user.id} className='flex items-center gap-4'>
            <Avatar className='h-9 w-9'>
              <AvatarImage
                src={`https://www.gravatar.com/avatar/${hashedEmail}?d=mp`}
                alt={user.username}
              />
              <AvatarFallback>{initials || '?'}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {user.username}
                </p>
                <p className='text-sm text-muted-foreground'>{user.email}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
