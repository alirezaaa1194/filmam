import { createFileRoute } from '@tanstack/react-router'
import { GeneralError } from '@/filmam/errors/generalError/generalError.index'

export const Route = createFileRoute('/(errors)/500')({
  component: GeneralError,
})
