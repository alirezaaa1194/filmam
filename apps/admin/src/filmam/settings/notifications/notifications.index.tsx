import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/utilities/components'
import { ContentSection } from '../contentSection/contentSection.index'
import { NotificationsForm } from './notificationsForm/notificationsForm.index'

export function SettingsNotifications() {
  const { t } = useTranslation()
  return (
    <>
      <PageTitle titleKey='notifications' />
      <ContentSection
      title={t('settings.notifications')}
      desc={t('settings.notifications_desc')}
    >
      <NotificationsForm />
    </ContentSection>
    </>
  )
}
