import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMovies } from '../moviesProvider/moviesProvider.index'

export function MoviesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useMovies()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('movies.add_movie')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
