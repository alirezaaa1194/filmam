import { useTranslation } from 'react-i18next'
import { Check, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'en', label: 'English', dir: 'ltr' as const },
  { code: 'fa', label: 'فارسی', dir: 'rtl' as const },
  { code: 'ar', label: 'العربية', dir: 'rtl' as const },
]

function Flag({ code }: { code: string }) {
  if (code === 'fa') {
    return (
      <svg viewBox='0 0 3 3' className='size-full'>
        <rect width='3' height='1' fill='#239f40' />
        <rect y='1' width='3' height='1' fill='#fff' />
        <rect y='2' width='3' height='1' fill='#da0000' />
      </svg>
    )
  }
  if (code === 'ar') {
    return (
      <svg viewBox='0 0 3 3' className='size-full'>
        <rect width='3' height='3' fill='#006C35' />
      </svg>
    )
  }
  return (
    <svg viewBox='0 0 3 3' className='size-full'>
      <rect width='3' height='3' fill='#012169' />
      <rect y='1' width='3' height='1' fill='#fff' />
      <rect x='1' width='1' height='3' fill='#fff' />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const { setDir } = useDirection()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <Languages className='size-[1.2rem]' />
          <span className='sr-only'>Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className='gap-2'
            onClick={() => {
              i18n.changeLanguage(lang.code)
              setDir(lang.dir)
            }}
          >
            <span className='flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full'>
              <Flag code={lang.code} />
            </span>
            <span>{lang.label}</span>
            <Check
              size={14}
              className={cn(
                'ms-auto',
                i18n.language !== lang.code && 'hidden'
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
