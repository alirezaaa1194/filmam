import { useTranslation } from 'react-i18next'
import { Check, Moon, Sun } from 'lucide-react'
import { Cn } from '@/scripts'
import { useTheme } from '@/context'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/utilities/components'

export function ThemeSwitch() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='size-9 rounded-full'>
          <Sun className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>{t('common.toggle_theme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          {t('theme.light')}{' '}
          <Check
            size={14}
            className={Cn('ms-auto', theme !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          {t('theme.dark')}
          <Check
            size={14}
            className={Cn('ms-auto', theme !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          {t('theme.system')}
          <Check
            size={14}
            className={Cn('ms-auto', theme !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
