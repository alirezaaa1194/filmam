import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Seasons } from '@/filmam/seasons/seasons.index'

const seasonsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/seasons/')({
  validateSearch: seasonsSearchSchema,
  component: Seasons,
})
