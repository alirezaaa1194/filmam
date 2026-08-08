import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Contacts } from '@/filmam/contacts/contacts.index'

const contactsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch('desc'),
  status: z.enum(['PENDING', 'ANSWERED', 'REJECTED']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/contacts/')({
  validateSearch: contactsSearchSchema,
  component: Contacts,
})
