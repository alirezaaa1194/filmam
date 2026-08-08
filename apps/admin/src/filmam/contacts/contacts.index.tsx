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
import type { ContactsApiResponseType } from './contacts.type'
import { ContactsDialogs } from './contactsDialogs/contactsDialogs.index'
import { ContactsProvider } from './contactsProvider/contactsProvider.index'
import { ContactsTable } from './contactsTable/contactsTable.index'

const route = getRouteApi('/_authenticated/contacts/')

export function Contacts() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'contacts',
      i18n.resolvedLanguage,
      search.search,
      search.status,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<ContactsApiResponseType>(AppApis.contact.adminAll, {
        method: 'GET',
        query: {
          page: search.page,
          page_size: search.pageSize,
          search: search.search || undefined,
          sort: search.sort?.toUpperCase(),
          status: search.status || undefined,
        },
      }),
  })

  return (
    <ContactsProvider>
      <PageTitle titleKey='contacts' />
      <Header fixed>
        <Search /> <LanguageSwitcher /> <ThemeSwitch />
        <NotificationDropdown /> <ConfigDrawer /> <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('contacts.list_title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('contacts.list_description')}
            </p>
          </div>
        </div>
        <ContactsTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>
      <ContactsDialogs />
    </ContactsProvider>
  )
}
