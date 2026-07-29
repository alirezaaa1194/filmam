import { useTranslation } from 'react-i18next'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { Cn } from '@/scripts'
import { Button, PageTitle } from '@/utilities/components'
type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <>
      <PageTitle titleKey='server_error' />
      <div className={Cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>{t('errors.500_title')}</h1>
        )}
        <span className='font-medium'>{t('errors.500_desc')}</span>
        <p className='text-center text-muted-foreground'>
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => history.go(-1)}>
              {t('common.go_back')}
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>{t('common.back_to_home')}</Button>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
