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
import type { GenresApiResponseType } from './genres.type'
import { GenresDialogs } from './genresDialogs/genresDialogs.index'
import { GenresPrimaryButtons } from './genresPrimaryButtons/genresPrimaryButtons.index'
import { GenresProvider } from './genresProvider/genresProvider.index'
import { GenresTable } from './genresTable/genresTable.index'
import { NotificationDropdown } from '../../utilities/components/notificationDropdown/notificationDropdown'

const route = getRouteApi('/_authenticated/genres/')

export function Genres() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'genres',
      i18n.resolvedLanguage,
      search.search,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<GenresApiResponseType>(AppApis.genre.all, {
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
    <GenresProvider>
      <PageTitle titleKey='genres' />
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
              {t('genres.title')}
            </h2>
            <p className='text-muted-foreground'>{t('genres.description')}</p>
          </div>
          <GenresPrimaryButtons />
        </div>
        <GenresTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>

      <GenresDialogs />
    </GenresProvider>
  )
}
