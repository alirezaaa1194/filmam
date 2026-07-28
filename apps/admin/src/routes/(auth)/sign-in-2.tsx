import { createFileRoute } from '@tanstack/react-router'
import { SignIn2 } from '@/filmam/auth/signIn2/signIn2.index'

export const Route = createFileRoute('/(auth)/sign-in-2')({
  component: SignIn2,
})
