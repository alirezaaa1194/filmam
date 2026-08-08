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
import type { TagsApiResponseType } from './tags.type'
import { TagsDialogs } from './tagsDialogs/tagsDialogs.index'
import { TagsPrimaryButtons } from './tagsPrimaryButtons/tagsPrimaryButtons.index'
import { TagsProvider } from './tagsProvider/tagsProvider.index'
import { TagsTable } from './tagsTable/tagsTable.index'

const route = getRouteApi('/_authenticated/tags/')

export function Tags() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'tags',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<TagsApiResponseType>(AppApis.tag.all, {
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
    <TagsProvider>
      <PageTitle titleKey='tags' />
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
              {t('tags.title')}
            </h2>
            <p className='text-muted-foreground'>{t('tags.description')}</p>
          </div>
          <TagsPrimaryButtons />
        </div>
        <TagsTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>

      <TagsDialogs />
    </TagsProvider>
  )
}
