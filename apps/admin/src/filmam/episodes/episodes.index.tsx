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
import type { EpisodesApiResponseType } from './episodes.type'
import { EpisodesDialogs } from './episodesDialogs/episodesDialogs.index'
import { EpisodesPrimaryButtons } from './episodesPrimaryButtons/episodesPrimaryButtons.index'
import { EpisodesProvider } from './episodesProvider/episodesProvider.index'
import { EpisodesTable } from './episodesTable/episodesTable.index'

const route = getRouteApi('/_authenticated/episodes/')

export function Episodes() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'episodes',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<EpisodesApiResponseType>(AppApis.episode.adminAll, {
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
    <EpisodesProvider>
      <PageTitle titleKey='episodes' />
      <Header fixed>
        <Search /> <LanguageSwitcher /> <ThemeSwitch />
        <NotificationDropdown /> <ConfigDrawer /> <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('episodes.list_title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('episodes.list_description')}
            </p>
          </div>
          <EpisodesPrimaryButtons />
        </div>
        <EpisodesTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>
      <EpisodesDialogs />
    </EpisodesProvider>
  )
}
