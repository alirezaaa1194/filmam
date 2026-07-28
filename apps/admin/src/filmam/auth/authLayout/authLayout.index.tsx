import { useTranslation } from 'react-i18next'
import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  return (
    <div className='container flex h-svh w-full max-w-none flex-col items-center justify-center p-0 px-8 lg:w-1/3 lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2' />
          <h1 className='text-xl font-medium'>{t('app_title.title')}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
