import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from '@/filmam/settings/profile'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsProfile,
})
