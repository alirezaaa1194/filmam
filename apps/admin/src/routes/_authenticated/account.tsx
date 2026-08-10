import { createFileRoute } from '@tanstack/react-router'
import { Account } from '@/filmam/account/account.index'

export const Route = createFileRoute('/_authenticated/account')({
  component: Account,
})