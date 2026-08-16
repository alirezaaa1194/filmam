import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  NavigationProgress,
  LoadingScreen,
  Toaster,
} from '@/utilities/components'

import { GeneralError } from '@/filmam/errors/generalError/generalError.index'
import { NotFoundError } from '@/filmam/errors/notFoundError/notFoundError.index'
import { __AppApis } from '../data/api'
import { Api, SetCookie } from '../scripts'
import { UserRoleEnum, type UserType } from '../types'
import { useUserStore } from '../stores'
import { changeLanguage } from 'i18next'
import { languageDirectionMap } from '@/utilities/config/direction'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  beforeLoad: async ({ location }) => {
    try {
      const user = await Api<UserType>(__AppApis.auth.me, { method: 'GET' })

      if (user.role !== UserRoleEnum.ADMIN) {
        return redirect({
          to: '/sign-in',
        })
      }

      useUserStore.getState().setUser(user)

      changeLanguage(user.preferred_language)

      const dir = languageDirectionMap[user.preferred_language]
      if (dir) {
        SetCookie('dir', dir, 60 * 60 * 24 * 365)
        document.documentElement.setAttribute('dir', dir)
      }

      if (
        location.pathname === '/sign-in' ||
        location.pathname === '/forgot-password'
      ) {
        return redirect({
          to: '/',
        })
      }
    } catch (err) {
      if (err instanceof Response) {
        if (err.status === 401 || err.status === 403 || err.status === 404) {
          if (
            location.pathname !== '/sign-in' &&
            location.pathname !== '/forgot-password'
          ) {
            throw redirect({
              to: '/sign-in',
            })
          }
        }
      }
    }
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  pendingComponent: LoadingScreen,
})
