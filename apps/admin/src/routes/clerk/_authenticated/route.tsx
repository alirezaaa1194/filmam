import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/utilities/components'
export const Route = createFileRoute('/clerk/_authenticated')({
  component: AuthenticatedLayout,
})
