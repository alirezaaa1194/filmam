import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from '@/filmam/settings/profile/profile.index'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsProfile,
})
