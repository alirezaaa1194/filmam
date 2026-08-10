import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer, Header, ProfileDropdown, Search, ThemeSwitch } from '@/utilities/components'
import { NotificationDropdown } from '@/utilities/components/notificationDropdown/notificationDropdown'




import { ForbiddenError } from '@/filmam/errors/forbidden/forbidden.index'
import { GeneralError } from '@/filmam/errors/generalError/generalError.index'
import { MaintenanceError } from '@/filmam/errors/maintenanceError/maintenanceError.index'
import { NotFoundError } from '@/filmam/errors/notFoundError/notFoundError.index'
import { UnauthorisedError } from '@/filmam/errors/unauthorizedError/unauthorizedError.index'

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: RouteComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { error } = Route.useParams()

  const errorMap: Record<string, React.ComponentType> = {
    unauthorized: UnauthorisedError,
    forbidden: ForbiddenError,
    'not-found': NotFoundError,
    'internal-server-error': GeneralError,
    'maintenance-error': MaintenanceError,
  }
  const ErrorComponent = errorMap[error] || NotFoundError

  return (
    <>
      <Header fixed className='border-b'>
        <Search className='me-auto' />
        <ThemeSwitch />
        <NotificationDropdown />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <div className='flex-1 [&>div]:h-full'>
        <ErrorComponent />
      </div>
    </>
  )
}
