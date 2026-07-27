import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentSales() {
  const { t } = useTranslation()
  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>{t('dashboard_names.olivia_martin')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('dashboard_names.olivia_email')}
            </p>
          </div>
          <div className='font-medium'>+$1,999.00</div>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Avatar className='flex h-9 w-9 items-center justify-center space-y-0 border'>
          <AvatarImage src='/avatars/02.png' alt='Avatar' />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>{t('dashboard_names.jackson_lee')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('dashboard_names.jackson_email')}
            </p>
          </div>
          <div className='font-medium'>+$39.00</div>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/03.png' alt='Avatar' />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>{t('dashboard_names.isabella_nguyen')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('dashboard_names.isabella_email')}
            </p>
          </div>
          <div className='font-medium'>+$299.00</div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/04.png' alt='Avatar' />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>{t('dashboard_names.william_kim')}</p>
            <p className='text-sm text-muted-foreground'>{t('dashboard_names.william_email')}</p>
          </div>
          <div className='font-medium'>+$99.00</div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/05.png' alt='Avatar' />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>{t('dashboard_names.sofia_davis')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('dashboard_names.sofia_email')}
            </p>
          </div>
          <div className='font-medium'>+$39.00</div>
        </div>
      </div>
    </div>
  )
}
