import { Button } from '@/utilities/components'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useHeaderMenus } from '../headerMenusProvider/headerMenusProvider.index'

export function HeaderMenusPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useHeaderMenus()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>{t('header_menus.add_header_menu')}</span> <Plus size={18} />
    </Button>
  )
}
