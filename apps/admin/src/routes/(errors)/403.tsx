import { createFileRoute } from '@tanstack/react-router'
import { ForbiddenError } from '@/filmam/errors/forbidden/forbidden.index'

export const Route = createFileRoute('/(errors)/403')({
  component: ForbiddenError,
})
