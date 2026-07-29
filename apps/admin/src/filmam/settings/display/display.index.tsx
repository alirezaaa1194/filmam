import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/utilities/components'
import { ContentSection } from '../contentSection/contentSection.index'
import { DisplayForm } from './displayForm/displayForm.index'

export function SettingsDisplay() {
  const { t } = useTranslation()
  return (
    <>
      <PageTitle titleKey='display' />
      <ContentSection
      title={t('settings.display')}
      desc={t('settings.display_desc')}
    >
      <DisplayForm />
    </ContentSection>
    </>
  )
}
