import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSections } from '../sectionsProvider/sectionsProvider.index'

export function SectionsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useSections()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('sections.add_section')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
