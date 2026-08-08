import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFactors } from '../factorsProvider/factorsProvider.index'

export function FactorsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useFactors()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('factors.add_factor')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
