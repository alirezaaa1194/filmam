import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/filmam/users/users.index'
import { roles } from '@/filmam/users/users.data'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  username: z.string().optional().catch(''),
  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),
  blocked: z.enum(['all', 'blocked', 'unblocked']).optional().catch('all'),
  sort: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
})
