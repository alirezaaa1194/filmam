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
import type { CommentsApiResponseType } from './comments.type'
import { CommentsDialogs } from './commentsDialogs/commentsDialogs.index'
import { CommentsProvider } from './commentsProvider/commentsProvider.index'
import { CommentsTable } from './commentsTable/commentsTable.index'

const route = getRouteApi('/_authenticated/comments/')

export function Comments() {
  const { t, i18n } = useTranslation()
  const search = route.useSearch()

  const { data, isPending } = useQuery({
    queryKey: [
      'comments',
      i18n.resolvedLanguage,
      search.search,
      search.status,
      search.page,
      search.pageSize,
      search.sort,
    ],
    queryFn: () =>
      Api<CommentsApiResponseType>(AppApis.comment.adminAll, {
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
    <CommentsProvider>
      <PageTitle titleKey='comments' />
      <Header fixed>
        <Search /> <LanguageSwitcher /> <ThemeSwitch />
        <NotificationDropdown /> <ConfigDrawer /> <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('comments.list_title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('comments.list_description')}
            </p>
          </div>
        </div>
        <CommentsTable
          data={data?.data ?? []}
          count={data?.count ?? 0}
          isPending={isPending}
        />
      </Main>
      <CommentsDialogs />
    </CommentsProvider>
  )
}
