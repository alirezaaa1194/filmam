import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/filmam/dashboard/dashboard.index'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
})
