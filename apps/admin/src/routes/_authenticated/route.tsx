import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/utilities/components'
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})
