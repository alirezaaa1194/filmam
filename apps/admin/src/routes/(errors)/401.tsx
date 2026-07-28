import { createFileRoute } from '@tanstack/react-router'
import { UnauthorisedError } from '@/filmam/errors/unauthorizedError/unauthorizedError.index'

export const Route = createFileRoute('/(errors)/401')({
  component: UnauthorisedError,
})
