import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguages } from '../languagesProvider/languagesProvider.index'

export function LanguagesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useLanguages()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('languages.add_language')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
