import { useTranslation } from 'react-i18next'

export function LoadingScreen() {
  const { t } = useTranslation()
  return (
    <div className='flex h-svh w-full flex-col items-center justify-center gap-8'>
      <div className='flex flex-col items-center gap-4'>
        <img
          src='/images/logo.svg'
          alt={t('app_title.title')}
          className='h-24 w-24 animate-pulse drop-shadow-lg'
        />
        <h1 className='text-2xl font-bold tracking-tight'>
          {t('app_title.title')}
        </h1>
      </div>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <span className='h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground' />
        {t('common.loading')}
      </div>
    </div>
  )
}