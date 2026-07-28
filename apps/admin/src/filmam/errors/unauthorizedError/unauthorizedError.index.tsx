import { useTranslation } from 'react-i18next'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/utilities/components'
export function UnauthorisedError() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>{t('errors.401_title')}</h1>
        <span className='font-medium'>{t('errors.401_desc')}</span>
        <p className='text-center text-muted-foreground'>
          Please log in with the appropriate credentials <br /> to access this
          resource.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            {t('common.go_back')}
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>{t('common.back_to_home')}</Button>
        </div>
      </div>
    </div>
  )
}
