import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { __AppApis } from '../data/api'

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
    function getCookie(name: string): string | null {
      const value = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))

      return value ? decodeURIComponent(value.split('=')[1]) : null
    }

    try {
      const response = await fetch(__AppApis.auth.me, {
        headers: {
          Authorization: `Bearer ${getCookie('AccessToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Unauthorized')
      }
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
