import { z } from 'zod'
import type { ContactType } from '../../types'

export type Contact = ContactType

export type ContactsApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Contact[]
}

export const contactStatuses = ['PENDING', 'ANSWERED', 'REJECTED'] as const
export type ContactStatusValue = (typeof contactStatuses)[number]

export type AnswerContactPayloadType = {
  answer_message: string
}

export type RejectContactPayloadType = {
  rejected_detail: string
}

export type UpdateContactsStatusPayloadType = {
  contact_ids: number[]
  status: ContactStatusValue
}

export const deleteContactsSchema = z.object({
  contact_ids: z.array(z.number()),
})
export type DeleteContactsPayloadType = z.infer<typeof deleteContactsSchema>
