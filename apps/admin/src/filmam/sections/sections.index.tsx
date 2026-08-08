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
import type { SectionsApiResponseType } from './sections.type'
import { SectionsDialogs } from './sectionsDialogs/sectionsDialogs.index'
import { SectionsPrimaryButtons } from './sectionsPrimaryButtons/sectionsPrimaryButtons.index'
import { SectionsProvider } from './sectionsProvider/sectionsProvider.index'
import { SectionsTable } from './sectionsTable/sectionsTable.index'

const route = getRouteApi('/_authenticated/sections/')

export function Sections() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'sections',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<SectionsApiResponseType>(AppApis.section.adminAll, {
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
    <SectionsProvider>
      <PageTitle titleKey='sections' />
      <Header fixed>
        <Search /> <LanguageSwitcher /> <ThemeSwitch />
        <NotificationDropdown /> <ConfigDrawer /> <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('sections.list_title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('sections.list_description')}
            </p>
          </div>
          <SectionsPrimaryButtons />
        </div>
        <SectionsTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>
      <SectionsDialogs />
    </SectionsProvider>
  )
}
