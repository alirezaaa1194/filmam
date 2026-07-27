import { Cn } from '@/scripts'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={Cn('animate-pulse rounded-md bg-accent', className)}
      {...props}
    />
  )
}

export { Skeleton }
