import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/utilities/components'
import { useUsers } from '../usersProvider/usersProvider.index'

export function UsersPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useUsers()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('users.add_user')}</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}