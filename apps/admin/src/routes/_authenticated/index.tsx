import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/filmam/dashboard/dashboard.index'
import { UserRoleEnum, UserType } from '../../types'
import { Api, SetCookie } from '../../scripts'
import { AppApis } from '../../data'
import { useUserStore } from '../../stores'
import { changeLanguage } from 'i18next'
import { languageDirectionMap } from '../../utilities/config/direction'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
   beforeLoad: async () => {
      try {
        const user = await Api<UserType>(AppApis.auth.me, { method: 'GET' })
  
        if (user.role !== UserRoleEnum.ADMIN) {
          throw redirect({ to: '/sign-in' })
        }
  
        useUserStore.getState().setUser(user)
        changeLanguage(user.preferred_language)
  
        const dir = languageDirectionMap[user.preferred_language]
        if (dir) {
          SetCookie('dir', dir, 60 * 60 * 24 * 365)
          document.documentElement.setAttribute('dir', dir)
        }
  
        return { user }
      } catch (err) {
        if (err instanceof Response) {
          if ([401, 403, 404].includes(err.status)) {
            throw redirect({ to: '/sign-in' })
          }
        }
  
        throw err
      }
    },
})
