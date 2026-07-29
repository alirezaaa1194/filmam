import {
  LayoutDashboard,
  Monitor,
  ListTodo,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { type SidebarData } from './appSidebar.type'
import type { TFunction } from 'i18next'

export function getSidebarData(t: TFunction): SidebarData {
  return {
    user: {
      name: 'satnaing',
      email: 'satnaingdev@gmail.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Shadcn Admin',
        logo: Command,
        plan: 'Vite + ShadcnUI',
      },
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
    ],
    navGroups: [
      {
        title: t('nav.general'),
        items: [
          {
            title: t('nav.dashboard'),
            url: '/',
            icon: LayoutDashboard,
          },
          {
            title: t('nav.tasks'),
            url: '/tasks',
            icon: ListTodo,
          },
          {
            title: t('nav.users'),
            url: '/users',
            icon: Users,
          },
        ],
      },
      {
        title: t('nav.other'),
        items: [
          {
            title: t('nav.settings'),
            icon: Settings,
            items: [
              {
                title: t('nav.profile'),
                url: '/settings',
                icon: UserCog,
              },
              {
                title: t('nav.account'),
                url: '/settings/account',
                icon: Wrench,
              },
              {
                title: t('nav.appearance'),
                url: '/settings/appearance',
                icon: Palette,
              },
              {
                title: t('nav.notifications'),
                url: '/settings/notifications',
                icon: Bell,
              },
              {
                title: t('nav.display'),
                url: '/settings/display',
                icon: Monitor,
              },
            ],
          },
        ],
      },
    ],
  }
}
