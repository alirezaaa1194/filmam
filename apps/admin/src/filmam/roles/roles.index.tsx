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
import type { RolesApiResponseType } from './roles.type'
import { RolesDialogs } from './rolesDialogs/rolesDialogs.index'
import { RolesPrimaryButtons } from './rolesPrimaryButtons/rolesPrimaryButtons.index'
import { RolesProvider } from './rolesProvider/rolesProvider.index'
import { RolesTable } from './rolesTable/rolesTable.index'
import { NotificationDropdown } from '../../utilities/components/notificationDropdown/notificationDropdown'

const route = getRouteApi('/_authenticated/roles/')

export function Roles() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'roles',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<RolesApiResponseType>(AppApis.role.all, {
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
    <RolesProvider>
      <PageTitle titleKey='roles' />
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
              {t('roles.title')}
            </h2>
            <p className='text-muted-foreground'>{t('roles.description')}</p>
          </div>
          <RolesPrimaryButtons />
        </div>
        <RolesTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>

      <RolesDialogs />
    </RolesProvider>
  )
}
