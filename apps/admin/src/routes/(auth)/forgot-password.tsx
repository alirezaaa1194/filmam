import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/filmam/auth/forgotPassword/forgotPassword.index'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPassword,
})
