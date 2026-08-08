import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTags } from '../tagsProvider/tagsProvider.index'

export function TagsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useTags()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('tags.add_tag')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
