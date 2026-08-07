import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
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

import { UsersDialogs } from './usersDialogs/usersDialogs.index'
import { UsersPrimaryButtons } from './usersPrimaryButtons/usersPrimaryButtons.index'
import { UsersProvider } from './usersProvider/usersProvider.index'
import { UsersTable } from './usersTable/usersTable.index'
import { Api } from '../../scripts'
import { AppApis } from '../../data'
import type { UserType } from '../../types'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const { t } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'users',
      search.username,
      search.page,
      search.pageSize,
      search.blocked,
      search.sort,
    ],
    queryFn: () =>
      Api<UserType[]>(AppApis.user.adminAll, {
        method: 'GET',
        query: {
          page: search.page,
          page_size: search.pageSize,
          search: search.username || undefined,
          blocked: search.blocked === 'blocked' ? true : undefined,
          sort: search.sort,
        },
      }),
  })

  return (
    <UsersProvider>
      <PageTitle titleKey='users' />
      <Header fixed>
        <Search />
        <LanguageSwitcher />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('users.title')}
            </h2>
            <p className='text-muted-foreground'>{t('users.description')}</p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable data={data ?? []} isPending={isPending} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
