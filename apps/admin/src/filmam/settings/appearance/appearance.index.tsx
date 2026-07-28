import { useTranslation } from 'react-i18next'
import { ContentSection } from '../contentSection/contentSection.index'
import { AppearanceForm } from './appearanceForm/appearanceForm.index'

export function SettingsAppearance() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.appearance')}
      desc={t('settings.appearance_desc')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
