import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer, Header, ProfileDropdown, Search, ThemeSwitch } from '@/utilities/components'




import { ForbiddenError } from '@/filmam/errors/forbidden'
import { GeneralError } from '@/filmam/errors/general-error'
import { MaintenanceError } from '@/filmam/errors/maintenance-error'
import { NotFoundError } from '@/filmam/errors/not-found-error'
import { UnauthorisedError } from '@/filmam/errors/unauthorized-error'

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
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <div className='flex-1 [&>div]:h-full'>
        <ErrorComponent />
      </div>
    </>
  )
}
