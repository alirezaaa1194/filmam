import i18n from '@/i18n'
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

export const sidebarData: SidebarData = {
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
      title: i18n.t('nav.general'),
      items: [
        {
          title: i18n.t('nav.dashboard'),
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: i18n.t('nav.tasks'),
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: i18n.t('nav.users'),
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: i18n.t('nav.other'),
      items: [
        {
          title: i18n.t('nav.settings'),
          icon: Settings,
          items: [
            {
              title: i18n.t('nav.profile'),
              url: '/settings',
              icon: UserCog,
            },
            {
              title: i18n.t('nav.account'),
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: i18n.t('nav.appearance'),
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: i18n.t('nav.notifications'),
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: i18n.t('nav.display'),
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
}
