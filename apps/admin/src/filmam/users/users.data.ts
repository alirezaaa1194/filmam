// import { faker } from '@faker-js/faker'
import { UserCheck, Users } from 'lucide-react'
import { UserRoleEnum, type UserType } from '../../types'

// faker.seed(67890)

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

// export const users = Array.from({ length: 500 }, () => {
//   const firstName = faker.person.firstName()
//   const lastName = faker.person.lastName()
//   return {
//     id: faker.string.uuid(),
//     firstName,
//     lastName,
//     username: faker.internet
//       .username({ firstName, lastName })
//       .toLocaleLowerCase(),
//     email: faker.internet.email({ firstName }).toLocaleLowerCase(),
//     phoneNumber: faker.phone.number({ style: 'international' }),
//     status: faker.helpers.arrayElement([
//       'active',
//       'inactive',
//       'invited',
//       'suspended',
//     ]),
//     role: faker.helpers.arrayElement(['admin', 'manager']),
//     createdAt: faker.date.past(),
//     updatedAt: faker.date.recent(),
//   }
// })
