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
import type { FactorsApiResponseType } from './factors.type'
import { FactorsDialogs } from './factorsDialogs/factorsDialogs.index'
import { FactorsPrimaryButtons } from './factorsPrimaryButtons/factorsPrimaryButtons.index'
import { FactorsProvider } from './factorsProvider/factorsProvider.index'
import { FactorsTable } from './factorsTable/factorsTable.index'

const route = getRouteApi('/_authenticated/factors/')

export function Factors() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'factors',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<FactorsApiResponseType>(AppApis.factor.all, {
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
    <FactorsProvider>
      <PageTitle titleKey='factors' />
      <Header fixed>
        <Search />
        <LanguageSwitcher />
        <ThemeSwitch />
        <NotificationDropdown />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('factors.title')}
            </h2>
            <p className='text-muted-foreground'>{t('factors.description')}</p>
          </div>
          <FactorsPrimaryButtons />
        </div>
        <FactorsTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>

      <FactorsDialogs />
    </FactorsProvider>
  )
}
