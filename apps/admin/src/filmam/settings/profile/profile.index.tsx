import { useTranslation } from 'react-i18next'
import { ContentSection } from '../contentSection/contentSection.index'
import { ProfileForm } from './profileForm/profileForm.index'

export function SettingsProfile() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.profile')}
      desc={t('settings.profile_desc')}
    >
      <ProfileForm />
    </ContentSection>
  )
}
