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
import type { LanguagesApiResponseType } from './languages.type'
import { LanguagesDialogs } from './languagesDialogs/languagesDialogs.index'
import { LanguagesPrimaryButtons } from './languagesPrimaryButtons/languagesPrimaryButtons.index'
import { LanguagesProvider } from './languagesProvider/languagesProvider.index'
import { LanguagesTable } from './languagesTable/languagesTable.index'

const route = getRouteApi('/_authenticated/languages/')

export function Languages() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'languages',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<LanguagesApiResponseType>(AppApis.language.all, {
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
    <LanguagesProvider>
      <PageTitle titleKey='languages' />
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
              {t('languages.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('languages.description')}
            </p>
          </div>
          <LanguagesPrimaryButtons />
        </div>
        <LanguagesTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>

      <LanguagesDialogs />
    </LanguagesProvider>
  )
}
