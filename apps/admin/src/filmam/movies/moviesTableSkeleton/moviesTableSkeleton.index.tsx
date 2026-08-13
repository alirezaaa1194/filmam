import { Skeleton } from '@/utilities/components'
import { Cn } from '@/scripts'

const COLUMN_COUNT = 12
const MOBILE_VISIBLE_COLUMNS = 4

function columnClassName(index: number) {
  return Cn(
    'h-4 flex-1',
    index === 0 && 'max-w-10',
    index >= MOBILE_VISIBLE_COLUMNS && 'max-sm:hidden'
  )
}

export function MoviesTableSkeleton() {
  return (
    <div className='overflow-hidden rounded-md border'>
      <div className='flex items-center gap-4 border-b p-4'>
        {Array.from({ length: COLUMN_COUNT }).map((_, index) => (
          <Skeleton key={index} className={columnClassName(index)} />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div key={rowIndex} className='flex items-center gap-4 border-b p-4'>
          {Array.from({ length: COLUMN_COUNT }).map((_, colIndex) => (
            <Skeleton key={colIndex} className={columnClassName(colIndex)} />
          ))}
        </div>
      ))}
    </div>
  )
}