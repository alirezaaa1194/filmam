import { useTranslation } from 'react-i18next'

type PageTitleProps = {
  titleKey: string
}

export function PageTitle({ titleKey }: PageTitleProps) {
  const { t } = useTranslation()
  const titleValue = `${t(`page_titles.${titleKey}`)} | ${t('app_title.title')}`
  return <title>{titleValue}</title>
}
