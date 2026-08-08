import { Skeleton } from '@/utilities/components'

export function RoleDialogSkeleton() {
  return (
    <div className='space-y-4 px-0.5'>
      <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
        <Skeleton className='col-span-2 ms-auto h-4 w-16' />
        <Skeleton className='col-span-4 h-9 w-full rounded-md' />
      </div>
      <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
        <Skeleton className='col-span-2 ms-auto h-4 w-16' />
        <Skeleton className='col-span-4 h-9 w-full rounded-md' />
      </div>
      <Skeleton className='h-9 w-full rounded-md' />
      <div className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
        <Skeleton className='col-span-2 ms-auto h-4 w-16' />
        <Skeleton className='col-span-4 h-9 w-full rounded-md' />
      </div>
      <div className='flex justify-end'>
        <Skeleton className='h-9 w-36 rounded-md' />
      </div>
    </div>
  )
}
