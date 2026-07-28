import { useTranslation } from 'react-i18next'
import { ConfigDrawer, Header, LanguageSwitcher, Main, ProfileDropdown, Search, ThemeSwitch } from '@/utilities/components'

import { TasksDialogs } from './tasksDialogs/tasksDialogs.index'
import { TasksPrimaryButtons } from './tasksPrimaryButtons/tasksPrimaryButtons.index'
import { TasksProvider } from './tasksProvider/tasksProvider.index'
import { TasksTable } from './tasksTable/tasksTable.index'
import { tasks } from './tasks.data'

export function Tasks() {
  const { t } = useTranslation()

  return (
    <TasksProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t('tasks.title')}</h2>
            <p className='text-muted-foreground'>
              {t('tasks.description')}
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <TasksTable data={tasks} />
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
