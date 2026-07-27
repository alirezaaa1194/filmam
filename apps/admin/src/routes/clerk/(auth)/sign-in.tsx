import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/react'
import { Skeleton } from '@/utilities/components'
export const Route = createFileRoute('/clerk/(auth)/sign-in')({
  component: () => (
    <SignIn
      initialValues={{
        emailAddress: 'your_mail+shadcn_admin@gmail.com',
      }}
      fallback={<Skeleton className='h-120 w-100' />}
    />
  ),
})
