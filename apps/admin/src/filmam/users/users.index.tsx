import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  ConfigDrawer,
  Header,
  LanguageSwitcher,
  Main,
  ProfileDropdown,
  Search,
  ThemeSwitch,
} from '@/utilities/components'

import { UsersDialogs } from './usersDialogs/usersDialogs.index'
import { UsersPrimaryButtons } from './usersPrimaryButtons/usersPrimaryButtons.index'
import { UsersProvider } from './usersProvider/usersProvider.index'
import { UsersTable } from './usersTable/usersTable.index'
import { users } from './users.data'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const { t } = useTranslation()
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <UsersProvider>
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
        <UsersTable data={users} search={search} navigate={navigate} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
