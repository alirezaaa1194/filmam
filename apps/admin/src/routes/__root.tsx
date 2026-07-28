import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NavigationProgress, Toaster } from '@/utilities/components'

import { GeneralError } from '@/filmam/errors/generalError/generalError.index'
import { NotFoundError } from '@/filmam/errors/notFoundError/notFoundError.index'
import { __AppApis } from '../data/api'
import { Api } from '../scripts'
import { UserType } from '../types'

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
      await Api<UserType>(__AppApis.auth.me, { method: 'GET' })
    } catch (err) {
      if (location.pathname !== '/sign-in') {
        throw redirect({
          to: '/sign-in',
        })
      }
    }
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
