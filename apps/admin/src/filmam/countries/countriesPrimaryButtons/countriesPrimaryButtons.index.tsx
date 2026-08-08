import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCountries } from '../countriesProvider/countriesProvider.index'

export function CountriesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useCountries()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('countries.add_country')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
