import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  ConfigDrawer,
  Header,
  LanguageSwitcher,
  Main,
  PageTitle,
  ProfileDropdown,
  Search,
  ThemeSwitch,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { AppApis } from '../../data'
import { Api } from '../../scripts'
import { NotificationDropdown } from '../../utilities/components/notificationDropdown/notificationDropdown'
import type { SeasonsApiResponseType } from './seasons.type'
import { SeasonsDialogs } from './seasonsDialogs/seasonsDialogs.index'
import { SeasonsPrimaryButtons } from './seasonsPrimaryButtons/seasonsPrimaryButtons.index'
import { SeasonsProvider } from './seasonsProvider/seasonsProvider.index'
import { SeasonsTable } from './seasonsTable/seasonsTable.index'

const route = getRouteApi('/_authenticated/seasons/')

export function Seasons() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'seasons',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<SeasonsApiResponseType>(AppApis.season.adminAll, {
        method: 'GET',
        query: {
          page: search.page,
          page_size: search.pageSize,
          search: search.search || undefined,
          sort: search.sort?.toUpperCase(),
        },
      }),
  })

  return (
    <SeasonsProvider>
      <PageTitle titleKey='seasons' />
      <Header fixed>
        <Search /> <LanguageSwitcher /> <ThemeSwitch />
        <NotificationDropdown /> <ConfigDrawer /> <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('seasons.list_title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('seasons.list_description')}
            </p>
          </div>
          <SeasonsPrimaryButtons />
        </div>
        <SeasonsTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>
      <SeasonsDialogs />
    </SeasonsProvider>
  )
}
