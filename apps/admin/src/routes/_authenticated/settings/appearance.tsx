import { createFileRoute } from '@tanstack/react-router'
import { SettingsAppearance } from '@/filmam/settings/appearance/appearance.index'

export const Route = createFileRoute('/_authenticated/settings/appearance')({
  component: SettingsAppearance,
})
