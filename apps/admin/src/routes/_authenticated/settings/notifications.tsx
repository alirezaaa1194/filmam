import { createFileRoute } from '@tanstack/react-router'
import { SettingsNotifications } from '@/filmam/settings/notifications/notifications.index'

export const Route = createFileRoute('/_authenticated/settings/notifications')({
  component: SettingsNotifications,
})
