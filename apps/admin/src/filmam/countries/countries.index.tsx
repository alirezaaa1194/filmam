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
import type { CountriesApiResponseType } from './countries.type'
import { CountriesDialogs } from './countriesDialogs/countriesDialogs.index'
import { CountriesPrimaryButtons } from './countriesPrimaryButtons/countriesPrimaryButtons.index'
import { CountriesProvider } from './countriesProvider/countriesProvider.index'
import { CountriesTable } from './countriesTable/countriesTable.index'

const route = getRouteApi('/_authenticated/countries/')

export function Countries() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'countries',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<CountriesApiResponseType>(AppApis.country.all, {
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
    <CountriesProvider>
      <PageTitle titleKey='countries' />
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
              {t('countries.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('countries.description')}
            </p>
          </div>
          <CountriesPrimaryButtons />
        </div>
        <CountriesTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>

      <CountriesDialogs />
    </CountriesProvider>
  )
}
