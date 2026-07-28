import { useTranslation } from 'react-i18next'
import { ContentSection } from '../contentSection/contentSection.index'
import { DisplayForm } from './displayForm/displayForm.index'

export function SettingsDisplay() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.display')}
      desc={t('settings.display_desc')}
    >
      <DisplayForm />
    </ContentSection>
  )
}
