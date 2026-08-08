import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Sections } from '@/filmam/sections/sections.index'

const sectionsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/sections/')({
  validateSearch: sectionsSearchSchema,
  component: Sections,
})
