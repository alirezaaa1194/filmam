import { Skeleton } from '@/utilities/components'
import { Cn } from '@/scripts'

export function ContactsTableSkeleton() {
  return (
    <div className='overflow-hidden rounded-md border'>
      <div className='flex items-center gap-4 border-b p-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className={Cn('h-4 flex-1', index === 0 && 'max-w-10')}
          />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div key={rowIndex} className='flex items-center gap-4 border-b p-4'>
          {Array.from({ length: 6 }).map((_, colIndex) => (
            <Skeleton key={colIndex} className='h-4 flex-1' />
          ))}
        </div>
      ))}
    </div>
  )
}
