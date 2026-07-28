import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/filmam/auth/otp/otp.index'

export const Route = createFileRoute('/(auth)/otp')({
  component: Otp,
})
