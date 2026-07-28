import { useTranslation } from 'react-i18next'
import { ContentSection } from '../contentSection/contentSection.index'
import { NotificationsForm } from './notificationsForm/notificationsForm.index'

export function SettingsNotifications() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.notifications')}
      desc={t('settings.notifications_desc')}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
