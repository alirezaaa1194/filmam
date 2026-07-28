import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/filmam/settings/settings.index'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
})
