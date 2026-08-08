import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Tags } from '@/filmam/tags/tags.index'

const tagsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/tags/')({
  validateSearch: tagsSearchSchema,
  component: Tags,
})
