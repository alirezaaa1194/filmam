import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfigDrawer,
  EmptyState,
  Header,
  LanguageSwitcher,
  Main,
  PageTitle,
  ProfileDropdown,
  Search,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeSwitch,
} from '@/utilities/components'
import { ChartColumn, Clock, Eye, Film, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AppApis } from '@/data'
import { Api } from '@/scripts'
import { type StatsOverviewType } from '@/types'
import { NotificationDropdown } from '@/utilities/components/notificationDropdown/notificationDropdown'
import { Analytics } from './analytics/analytics.index'
import { GrowthRate } from './growthRate/growthRate.index'
import { Overview } from './overview/overview.index'
import { RecentSales } from './recentSales/recentSales.index'
import { formatNumber } from './dashboard.script'

export function Dashboard() {
  const { t, i18n } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['stats-overview'],
    queryFn: () =>
      Api<StatsOverviewType>(AppApis.admin.statsOverview, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const ready = !isLoading && data

  return (
    <>
      <PageTitle titleKey='dashboard' />

      <Header>
        <Search />
        <LanguageSwitcher />
        <ThemeSwitch />
        <NotificationDropdown />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          {ready ? (
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('dashboard.title')}
            </h1>
          ) : (
            <Skeleton className='h-9 w-48' />
          )}
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>
                {t('dashboard.overview')}
              </TabsTrigger>
              <TabsTrigger value='analytics'>
                {t('dashboard.analytics')}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  {ready ? (
                    <CardTitle className='text-sm font-medium'>
                      {t('dashboard.total_views')}
                    </CardTitle>
                  ) : (
                    <Skeleton className='h-4 w-24' />
                  )}
                  {ready ? (
                    <Eye className='size-4 text-muted-foreground' />
                  ) : (
                    <Skeleton className='size-4' />
                  )}
                </CardHeader>
                <CardContent>
                  {ready ? (
                    <div className='text-2xl font-bold'>
                      {formatNumber(data?.cards_data.total_views ?? 0, i18n.resolvedLanguage)}
                    </div>
                  ) : (
                    <Skeleton className='h-8 w-20' />
                  )}
                  {ready ? (
                    <GrowthRate
                      value={data?.cards_data.view_growth_rate}
                      period='month'
                    />
                  ) : (
                    <Skeleton className='mt-2 h-3 w-36' />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  {ready ? (
                    <CardTitle className='text-sm font-medium'>
                      {t('dashboard.total_users')}
                    </CardTitle>
                  ) : (
                    <Skeleton className='h-4 w-24' />
                  )}
                  {ready ? (
                    <Users className='size-4 text-muted-foreground' />
                  ) : (
                    <Skeleton className='size-4' />
                  )}
                </CardHeader>
                <CardContent>
                  {ready ? (
                    <div className='text-2xl font-bold'>
                      {formatNumber(data?.cards_data.total_users ?? 0, i18n.resolvedLanguage)}
                    </div>
                  ) : (
                    <Skeleton className='h-8 w-20' />
                  )}
                  {ready ? (
                    <GrowthRate
                      value={data?.cards_data.users_growth_rate}
                      period='month'
                    />
                  ) : (
                    <Skeleton className='mt-2 h-3 w-36' />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  {ready ? (
                    <CardTitle className='text-sm font-medium'>
                      {t('dashboard.total_content')}
                    </CardTitle>
                  ) : (
                    <Skeleton className='h-4 w-24' />
                  )}
                  {ready ? (
                    <Film className='size-4 text-muted-foreground' />
                  ) : (
                    <Skeleton className='size-4' />
                  )}
                </CardHeader>
                <CardContent>
                  {ready ? (
                    <>
                      <div className='text-2xl font-bold'>
                        {formatNumber(data?.cards_data.total_content ?? 0, i18n.resolvedLanguage)}
                      </div>
                      <div className='flex w-full items-center gap-1'>
                        <p className='text-xs text-muted-foreground'>
                          {t('dashboard.total_series')}:{' '}
                          {data?.cards_data.total_series}
                        </p>
                        <p className='text-xs text-muted-foreground'>·</p>
                        <p className='text-xs text-muted-foreground'>
                          {t('dashboard.total_cinematic')}:{' '}
                          {data?.cards_data.total_cinematic}
                        </p>
                      </div>
                      <GrowthRate
                        value={data?.cards_data.movies_growth_rate}
                        period='month'
                      />
                    </>
                  ) : (
                    <>
                      <Skeleton className='h-8 w-20' />
                      <Skeleton className='mt-2 h-3 w-40' />
                      <Skeleton className='mt-1 h-3 w-28' />
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  {ready ? (
                    <CardTitle className='text-sm font-medium'>
                      {t('dashboard.total_watch_times')}
                    </CardTitle>
                  ) : (
                    <Skeleton className='h-4 w-24' />
                  )}
                  {ready ? (
                    <Clock className='size-4 text-muted-foreground' />
                  ) : (
                    <Skeleton className='size-4' />
                  )}
                </CardHeader>
                <CardContent>
                  {ready ? (
                    <div className='text-2xl font-bold'>
                      {formatNumber(data?.cards_data.total_watch_times ?? 0, i18n.resolvedLanguage)}
                    </div>
                  ) : (
                    <Skeleton className='h-8 w-20' />
                  )}
                  {ready ? (
                    <GrowthRate
                      value={data?.cards_data.watch_progress_growth}
                      period='month'
                    />
                  ) : (
                    <Skeleton className='mt-2 h-3 w-36' />
                  )}
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>{t('dashboard.watch_count')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.watch_count_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='ps-2'>
                  {ready ? (
                    data?.current_year_watch_data?.length ? (
                      <Overview data={data.current_year_watch_data} />
                    ) : (
                      <EmptyState
                        icon={ChartColumn}
                        title={t('common.no_results')}
                        description={t('common.no_data')}
                        className='h-[350px]'
                      />
                    )
                  ) : (
                    <Skeleton className='h-[350px] w-full' />
                  )}
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>{t('dashboard.recent_users')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.recent_users_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ready ? (
                    data?.recent_users?.length ? (
                      <RecentSales data={data.recent_users} />
                    ) : (
                      <EmptyState
                        icon={Users}
                        title={t('common.no_results')}
                        description={t('common.no_data')}
                      />
                    )
                  ) : (
                    <div className='space-y-8'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className='flex items-center gap-4'>
                          <Skeleton className='size-9 rounded-full' />
                          <div className='space-y-2'>
                            <Skeleton className='h-4 w-32' />
                            <Skeleton className='h-3 w-48' />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
