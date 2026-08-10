import type { TFunction } from 'i18next'
import {
  Clapperboard,
  Film,
  Globe,
  IdCard,
  Languages,
  LayoutDashboard,
  Layers,
  ListVideo,
  Mail,
  Menu,
  MessageSquare,
  Tag,
  UserRound,
  Users,
} from 'lucide-react'
import { type SidebarData } from './appSidebar.type'

export function getSidebarData(t: TFunction): SidebarData {
  return {
    user: {
      name: 'satnaing',
      email: 'satnaingdev@gmail.com',
      avatar: '/avatars/shadcn.jpg',
    },
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
            title: t('nav.movies'),
            url: '/movies',
            icon: Film,
          },
          {
            title: t('nav.seasons'),
            url: '/seasons',
            icon: Layers,
          },
          {
            title: t('nav.episodes'),
            url: '/episodes',
            icon: ListVideo,
          },
          {
            title: t('nav.sections'),
            url: '/sections',
            icon: Clapperboard,
          },
          {
            title: t('nav.genres'),
            url: '/genres',
            icon: Clapperboard,
          },
          {
            title: t('nav.tags'),
            url: '/tags',
            icon: Tag,
          },
          {
            title: t('nav.factors'),
            url: '/factors',
            icon: UserRound,
          },
          {
            title: t('nav.countries'),
            url: '/countries',
            icon: Globe,
          },
          {
            title: t('nav.languages'),
            url: '/languages',
            icon: Languages,
          },
          {
            title: t('nav.comments'),
            url: '/comments',
            icon: MessageSquare,
          },
          {
            title: t('nav.contacts'),
            url: '/contacts',
            icon: Mail,
          },
          {
            title: t('nav.users'),
            url: '/users',
            icon: Users,
          },
          {
            title: t('nav.roles'),
            url: '/roles',
            icon: IdCard,
          },
          {
            title: t('nav.header_menus'),
            url: '/header-menus',
            icon: Menu,
          },
        ],
      },
    ],
  }
}
