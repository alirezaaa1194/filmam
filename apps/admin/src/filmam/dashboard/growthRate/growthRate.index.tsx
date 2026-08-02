import { useTranslation } from 'react-i18next'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Cn } from '@/scripts'

export function GrowthRate({
  value,
  period,
  className,
}: {
  value?: number
  period: 'month' | 'week'
  className?: string
}) {
  const { t } = useTranslation()

  if (value === undefined || value === null) return null

  const isUp = value >= 0
  const Icon = isUp ? TrendingUp : TrendingDown

  return (
    <p
      className={Cn(
        'flex flex-wrap items-center gap-1 text-xs',
        isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive',
        className
      )}
    >
      <Icon className='size-3.5' />
      <span>
        {isUp ? '+' : ''}
        {value}%
      </span>
      <span className='text-muted-foreground'>
        {t(
          period === 'week'
            ? 'dashboard.vs_last_week'
            : 'dashboard.vs_last_month'
        )}
      </span>
    </p>
  )
}
