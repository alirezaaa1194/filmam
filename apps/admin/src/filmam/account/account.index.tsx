import { useTranslation } from 'react-i18next'
import {
  ConfigDrawer,
  Header,
  LanguageSwitcher,
  Main,
  PageTitle,
  ProfileDropdown,
  Search,
  Separator,
  ThemeSwitch,
} from '@/utilities/components'
import { NotificationDropdown } from '@/utilities/components/notificationDropdown/notificationDropdown'
import { ContentSection } from './contentSection/contentSection.index'
import { AccountForm } from './accountForm/accountForm.index'
import { ChangePasswordForm } from './changePasswordForm/changePasswordForm.index'

export function Account() {
  const { t } = useTranslation()
  return (
    <>
      <PageTitle titleKey='account' />

      <Header fixed>
        <Search />
        <LanguageSwitcher />
        <ThemeSwitch />
        <NotificationDropdown />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('account.title')}
          </h1>
          <p className='text-muted-foreground'>{t('account.description')}</p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='space-y-6'>
          <ContentSection
            title={t('account.account')}
            desc={t('account.account_desc')}
          >
            <AccountForm />
          </ContentSection>
          <ContentSection
            title={t('account.change_password')}
            desc={t('account.change_password_desc')}
          >
            <ChangePasswordForm />
          </ContentSection>
        </div>
      </Main>
    </>
  )
}
