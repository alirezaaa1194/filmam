import { createFileRoute } from '@tanstack/react-router'
import { NotFoundError } from '@/filmam/errors/notFoundError/notFoundError.index'

export const Route = createFileRoute('/(errors)/404')({
  component: NotFoundError,
})
