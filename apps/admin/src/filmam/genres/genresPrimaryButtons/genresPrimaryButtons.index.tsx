import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGenres } from '../genresProvider/genresProvider.index'

export function GenresPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useGenres()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('genres.add_genre')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
