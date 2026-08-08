import { Button } from '@/utilities/components'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useHeaderMenus } from '../headerMenusProvider/headerMenusProvider.index'

export function HeaderMenusPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useHeaderMenus()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('filters')}
      >
        <SlidersHorizontal size={16} />
        <span>{t('header_menus.manage_filters')}</span>
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('header_menus.add_header_menu')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}