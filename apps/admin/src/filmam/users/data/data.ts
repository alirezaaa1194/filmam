import i18n from '@/i18n'
import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'
import { type __UserStatus as UserStatus } from './schema'

export const __callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const __roles = [
  {
    label: i18n.t('users_data.superadmin'),
    value: 'superadmin',
    icon: Shield,
  },
  {
    label: i18n.t('users_data.admin'),
    value: 'admin',
    icon: UserCheck,
  },
  {
    label: i18n.t('users_data.manager'),
    value: 'manager',
    icon: Users,
  },
  {
    label: i18n.t('users_data.cashier'),
    value: 'cashier',
    icon: CreditCard,
  },
] as const
