import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Cn } from '@/scripts'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/utilities/components'
import { Button } from '../ui/button/button.index'

export function AppTitle() {
  const { t } = useTranslation()
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <div>
            <Link
              to='/'
              onClick={() => setOpenMobile(false)}
              className='grid flex-1 text-start text-sm leading-tight'
            >
              <span className='truncate font-bold'>{t('app_title.title')}</span>
              <span className='truncate text-xs'>{t('app_title.subtitle')}</span>
            </Link>
            <ToggleSidebar />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ToggleSidebar({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { t } = useTranslation()
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant='ghost'
      size='icon'
      className={Cn('aspect-square size-8 max-md:scale-125', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <X className='md:hidden' />
      <Menu className='max-md:hidden' />
      <span className='sr-only'>{t('common.toggle_sidebar')}</span>
    </Button>
  )
}
