import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Movies } from '@/filmam/movies/movies.index'

const moviesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch('desc'),
  sortBy: z
    .enum(['CREATED_AT', 'LIKES', 'WATCHES'])
    .optional()
    .catch(undefined),
  type: z.enum(['CINEMATIC', 'SERIES']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/movies/')({
  validateSearch: moviesSearchSchema,
  component: Movies,
})
