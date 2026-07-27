import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/filmam/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
})
