import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSeasons } from '../seasonsProvider/seasonsProvider.index'

export function SeasonsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useSeasons()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('seasons.add_season')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
