import { createFileRoute } from '@tanstack/react-router'
import { SettingsAccount } from '@/filmam/settings/account/account.index'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
})
