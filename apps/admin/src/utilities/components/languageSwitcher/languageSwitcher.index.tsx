import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Cn } from '@/scripts'
import { useDirection } from '@/context'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/utilities/components'
import fa from '@/assets/flags/fa.svg'
import en from '@/assets/flags/en.svg'
import ar from '@/assets/flags/ar.svg'
import { AppLanguagesEnum } from '../../../types'

const languages = [
  { code: AppLanguagesEnum.EN, label: 'English', dir: 'ltr' as const },
  { code: AppLanguagesEnum.FA, label: 'فارسی', dir: 'rtl' as const },
  { code: AppLanguagesEnum.AR, label: 'العربی', dir: 'rtl' as const },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const { setDir } = useDirection()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='scale-95 overflow-hidden rounded-full'
        >
          <img
            src={
              i18n.resolvedLanguage === AppLanguagesEnum.FA
                ? fa
                : i18n.resolvedLanguage === AppLanguagesEnum.EN
                  ? en
                  : i18n.resolvedLanguage === AppLanguagesEnum.AR
                    ? ar
                    : ''
            }
            className='size-full rounded-full object-cover'
            alt={`${i18n.language}-flag`}
          />
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
              <img
                src={
                  lang.code === AppLanguagesEnum.FA
                    ? fa
                    : lang.code === AppLanguagesEnum.EN
                      ? en
                      : lang.code === AppLanguagesEnum.AR
                        ? ar
                        : ''
                }
                className='size-5 rounded-full object-cover'
                alt={`${lang.code}-flag`}
              />
            </span>
            <span>{lang.label}</span>
            <Check
              size={14}
              className={Cn('ms-auto', i18n.language !== lang.code && 'hidden')}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
