import { UserCheck, Users } from 'lucide-react'
import i18n from '@/i18n'
import { UserRoleEnum, type UserType } from '../../types'

export const PERMANENT_BLOCK_DURATION_MS = 10 * 365 * 24 * 60 * 60 * 1000

const intlLocales: Record<string, string> = {
  FA: 'fa-IR-u-ca-persian',
  EN: 'en-US',
  AR: 'ar-EG',
}

export function formatUserCreatedAt(createdAt: string | Date) {
  const lang = (i18n.resolvedLanguage ?? 'EN').toUpperCase()
  return new Intl.DateTimeFormat(intlLocales[lang] ?? 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}

export const blockDurations = [
  { labelKey: 'users.duration_1h', ms: 60 * 60 * 1000 },
  { labelKey: 'users.duration_2h', ms: 2 * 60 * 60 * 1000 },
  { labelKey: 'users.duration_6h', ms: 6 * 60 * 60 * 1000 },
  { labelKey: 'users.duration_12h', ms: 12 * 60 * 60 * 1000 },
  { labelKey: 'users.duration_1d', ms: 24 * 60 * 60 * 1000 },
  { labelKey: 'users.duration_3d', ms: 3 * 24 * 60 * 60 * 1000 },
  { labelKey: 'users.duration_1w', ms: 7 * 24 * 60 * 60 * 1000 },
  { labelKey: 'users.duration_1M', ms: 30 * 24 * 60 * 60 * 1000 },
] as const

export const callTypes = new Map<string, string>([
  [
    'ADMIN',
    'bg-violet-100/60 text-violet-900 border-violet-300 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500',
  ],
  [
    'USER',
    'bg-neutral-200/50 text-neutral-800 border-neutral-300 dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-neutral-600',
  ],
])

export const roles = [
  {
    labelKey: 'users_data.admin',
    value: UserRoleEnum.ADMIN,
    icon: UserCheck,
  },
  {
    labelKey: 'users_data.user',
    value: UserRoleEnum.USER,
    icon: Users,
  },
] as const

export function isUserBanned(blockExpiresAt: UserType['block_expires_at']) {
  return blockExpiresAt !== null && new Date(blockExpiresAt) > new Date()
}

export function getRoleLabelKey(role: string) {
  return roles.find(({ value }) => value === role)?.labelKey ?? 'users_data.user'
}

export function getOppositeRole(role: string) {
  return role === UserRoleEnum.ADMIN ? UserRoleEnum.USER : UserRoleEnum.ADMIN
}
