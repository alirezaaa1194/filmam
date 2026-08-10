import { z } from 'zod'
import type { AllCommentsType } from '../../types'

export type Comment = AllCommentsType

export type CommentsApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Comment[]
}

export const commentStatuses = ['PENDING', 'APPROVED', 'REJECTED'] as const
export type CommentStatusValue = (typeof commentStatuses)[number]

export type UpdateCommentPayloadType = {
  body: string
}

export type UpdateCommentStatusPayloadType = {
  status: CommentStatusValue
}

export type UpdateCommentsStatusPayloadType = {
  comment_ids: number[]
  status: CommentStatusValue
}

export const deleteCommentsSchema = z.object({
  comment_ids: z.array(z.number()),
})
export type DeleteCommentsPayloadType = z.infer<typeof deleteCommentsSchema>
