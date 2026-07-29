import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/utilities/components'
import { ContentSection } from '../contentSection/contentSection.index'
import { ProfileForm } from './profileForm/profileForm.index'

export function SettingsProfile() {
  const { t } = useTranslation()
  return (
    <>
      <PageTitle titleKey='settings' />
      <ContentSection
      title={t('settings.profile')}
      desc={t('settings.profile_desc')}
    >
      <ProfileForm />
    </ContentSection>
    </>
  )
}
