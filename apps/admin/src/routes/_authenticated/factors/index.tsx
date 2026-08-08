import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Factors } from '@/filmam/factors/factors.index'

const factorsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/factors/')({
  validateSearch: factorsSearchSchema,
  component: Factors,
})
