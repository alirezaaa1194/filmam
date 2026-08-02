import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
} from '@/utilities/components'
import {
  ChartColumn,
  CircleCheck,
  Clapperboard,
  Play,
  Tags,
  UserCheck,
  Watch,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnalyticsChart } from '../analyticsChart/analyticsChart.index'
import { useQuery } from '@tanstack/react-query'
import { AppApis } from '@/data'
import { Api } from '@/scripts'
import { type StatsAnalyticsType } from '../../../types'
import { GrowthRate } from '../growthRate/growthRate.index'
import { formatNumber } from '../formatNumber'

export function Analytics() {
  const { t, i18n } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['stats-analytics'],
    queryFn: () =>
      Api<StatsAnalyticsType>(AppApis.admin.statsAnalytics, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const ready = !isLoading && data

  if (!ready) {
    return <AnalyticsSkeleton />
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.traffic_overview')}</CardTitle>
          <CardDescription>{t('dashboard.traffic_desc')}</CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          {data?.current_week_chart_data?.length ? (
            <AnalyticsChart data={data.current_week_chart_data} />
          ) : (
            <EmptyState
              icon={ChartColumn}
              title={t('common.no_results')}
              description={t('common.no_data')}
              className='h-[300px]'
            />
          )}
        </CardContent>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('dashboard.total_plays')}
            </CardTitle>
            <Play className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(data?.cards_data.total_plays ?? 0, i18n.resolvedLanguage)}
            </div>
            <GrowthRate
              value={data?.cards_data.total_plays_growth}
              period='week'
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('dashboard.unique_viewers')}
            </CardTitle>
            <UserCheck className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(data?.cards_data.unique_viewers ?? 0, i18n.resolvedLanguage)}
            </div>
            <GrowthRate
              value={data?.cards_data.unique_viewers_growth}
              period='week'
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('dashboard.completion_rate')}
            </CardTitle>
            <CircleCheck className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(data?.cards_data.completion_rate ?? 0, i18n.resolvedLanguage)}
            </div>
            <GrowthRate
              value={data?.cards_data.completion_rate_growth}
              period='week'
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('dashboard.avg_watch_time')}
            </CardTitle>
            <Watch className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(data?.cards_data.avg_watch_time ?? 0, i18n.resolvedLanguage)}
            </div>
            <GrowthRate
              value={data?.cards_data.avg_watch_time_growth}
              period='week'
            />
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader className='flex flex-row items-start justify-between space-y-0'>
            <div>
              <CardTitle>{t('dashboard.top_movies')}</CardTitle>
              <CardDescription>
                {t('dashboard.top_movies_desc')}
              </CardDescription>
            </div>
            <Clapperboard className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {data?.top_movies?.length ? (
              <SimpleBarList
                items={data.top_movies.map((movie) => ({
                  name: movie.title,
                  value: movie.plays_count,
                }))}
                barClass='bg-primary'
                valueFormatter={(n) => `${n}`}
              />
            ) : (
              <EmptyState
                icon={Clapperboard}
                title={t('common.no_results')}
                description={t('common.no_data')}
              />
            )}
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader className='flex flex-row items-start justify-between space-y-0'>
            <div>
              <CardTitle>{t('dashboard.top_genres')}</CardTitle>
              <CardDescription>
                {t('dashboard.top_genres_desc')}
              </CardDescription>
            </div>
            <Tags className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {data?.top_genres?.length ? (
              <SimpleBarList
                items={data.top_genres.map((genre) => ({
                  name: genre.name,
                  value: genre.plays_count,
                }))}
                barClass='bg-muted-foreground'
                valueFormatter={(n) => `${n}`}
              />
            ) : (
              <EmptyState
                icon={Tags}
                title={t('common.no_results')}
                description={t('common.no_data')}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-4 w-64' />
        </CardHeader>
        <CardContent className='px-6'>
          <Skeleton className='h-[300px] w-full' />
        </CardContent>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='size-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16' />
              <Skeleton className='mt-2 h-3 w-36' />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-48' />
          </CardHeader>
          <CardContent>
            <SimpleBarListSkeleton rows={5} />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-48' />
          </CardHeader>
          <CardContent>
            <SimpleBarListSkeleton rows={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SimpleBarListSkeleton({ rows }: { rows: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='flex items-center justify-between gap-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-10 shrink-0' />
        </div>
      ))}
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className='space-y-3'>
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name} className='flex items-center justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 truncate text-xs text-muted-foreground'>
                {i.name}
              </div>
              <div className='h-2.5 w-full rounded-full bg-muted'>
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums'>
              {valueFormatter(i.value)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
