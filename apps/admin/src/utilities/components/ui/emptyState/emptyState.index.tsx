import { Cn } from '@/scripts'

function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  className?: string
}) {
  return (
    <div
      className={Cn(
        'flex flex-col items-center justify-center gap-2 py-10 text-center',
        className
      )}
    >
      {Icon ? (
        <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
          <Icon className='size-6 text-muted-foreground' />
        </div>
      ) : null}
      <p className='text-sm font-medium text-foreground'>{title}</p>
      {description ? (
        <p className='text-xs text-muted-foreground'>{description}</p>
      ) : null}
    </div>
  )
}

export { EmptyState }
