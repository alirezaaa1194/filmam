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
import { HeaderMenusDialogs } from './headerMenusDialogs/headerMenusDialogs.index'
import { HeaderMenusPrimaryButtons } from './headerMenusPrimaryButtons/headerMenusPrimaryButtons.index'
import { HeaderMenusProvider } from './headerMenusProvider/headerMenusProvider.index'
import { HeaderMenusTable } from './headerMenusTable/headerMenusTable.index'
import type { HeaderMenusApiResponseType } from './headerMenus.type'

const route = getRouteApi('/_authenticated/header-menus/')

export function HeaderMenus() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'header-menus',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<HeaderMenusApiResponseType>(AppApis.headerMenu.adminAll, {
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
    <HeaderMenusProvider>
      <PageTitle titleKey='header_menus' />
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
              {t('header_menus.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('header_menus.description')}
            </p>
          </div>
          <HeaderMenusPrimaryButtons />
        </div>
        <HeaderMenusTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>

      <HeaderMenusDialogs />
    </HeaderMenusProvider>
  )
}