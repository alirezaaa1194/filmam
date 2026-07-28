import { createFileRoute } from '@tanstack/react-router'
import { SettingsDisplay } from '@/filmam/settings/display/display.index'

export const Route = createFileRoute('/_authenticated/settings/display')({
  component: SettingsDisplay,
})
