import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/utilities/components'
import { ContentSection } from '../contentSection/contentSection.index'
import { AccountForm } from './accountForm/accountForm.index'

export function SettingsAccount() {
  const { t } = useTranslation()
  return (
    <>
      <PageTitle titleKey='account' />
      <ContentSection
      title={t('settings.account')}
      desc={t('settings.account_desc')}
    >
      <AccountForm />
    </ContentSection>
    </>
  )
}
