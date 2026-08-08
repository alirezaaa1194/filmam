import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEpisodes } from '../episodesProvider/episodesProvider.index'

export function EpisodesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useEpisodes()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('episodes.add_episode')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
