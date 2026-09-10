import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@/filmam/auth/signIn/signIn.index'
import { AppApis } from '../../data'
import { UserRoleEnum, UserType } from '../../types'
import { Api } from '../../scripts'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
  beforeLoad: async () => {
  try {
    const user = await Api<UserType>(AppApis.auth.me, {
      method: 'GET',
    })

    if (user?.role === UserRoleEnum.ADMIN) {
      return redirect({ to: '/' })
    }
  } catch (err) {
    if (err instanceof Response) {
      if ([401, 403, 404].includes(err.status)) {
        return
      }
    }

    throw err
  }
},
})
