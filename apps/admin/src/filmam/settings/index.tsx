import { Outlet } from '@tanstack/react-router'
import { ConfigDrawer, Header, LanguageSwitcher, Main, ProfileDropdown, Search, Separator, ThemeSwitch } from '@/utilities/components'







import { useTranslation } from 'react-i18next'

export function Settings() {
  const { t } = useTranslation()
  return (
    <>
      <Header>
        <Search className='me-auto' />
        <LanguageSwitcher />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('settings.title')}
          </h1>
          <p className='text-muted-foreground'>
            {t('settings.description')}
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <Outlet />
        </div>
      </Main>
    </>
  )
}
