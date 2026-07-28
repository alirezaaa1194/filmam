import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@/filmam/auth/signUp/signUp.index'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp,
})
