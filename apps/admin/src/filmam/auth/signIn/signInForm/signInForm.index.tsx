import { useState, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { Cn, Api, SetCookie, TranslateServerError } from '@/scripts'
import { useDirection } from '@/context'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  Spinner,
} from '@/utilities/components'
import { useMutation } from '@tanstack/react-query'
import { AppApis } from '@/data'
import { IconGoogle } from '@/assets/brand-icons/icon-google'
import type { ApiErrorType, MessageType } from '@/types'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
  setStep: Dispatch<SetStateAction<'Login' | 'Otp'>>
  setEmail: Dispatch<SetStateAction<string>>
  setPassword: Dispatch<SetStateAction<string>>
  start: () => void
}

export function SignInForm({
  className,
  redirectTo,
  setStep,
  setEmail,
  setPassword,
  start,
  ...props
}: UserAuthFormProps) {
  const { t } = useTranslation()
  const { dir } = useDirection()
  const navigate = useNavigate()

  const formSchema = z.object({
    email: z.email({
      error: (iss) => (iss.input === '' ? t('auth.email_required') : undefined),
    }),
    password: z
      .string()
      .min(1, t('auth.password_required'))
      .min(7, t('auth.password_min_length')),
  })

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      Api<MessageType>(AppApis.auth.adminLogin, {
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    onSuccess: () => {
      setEmail(form.getValues('email'))
      setPassword(form.getValues('password'))
      setStep('Otp')
      start()
      toast.success(t('auth.otp_sent'))
    },
    onError: (response: ApiErrorType) => {
      toast.error(t(TranslateServerError(response.errors[0].status)))
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data)
  }

  return (
    <Card className='w-full gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>
          {t('auth.sign_in')}
        </CardTitle>
        <CardDescription>{t('auth.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={Cn('grid gap-3', className)}
            {...props}
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('auth.email_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t('auth.password_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <Link
                    to='/forgot-password'
                    className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
                  >
                    {t('auth.forgot_password_link')}
                  </Link>
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isPending || isGoogleLoading}>
              {t('auth.sign_in')}
              {isPending ? <Spinner /> : dir === 'rtl' ? <LogIn className='scale-x-[-1]' /> : <LogIn />}
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  {t('auth.or_continue_with')}
                </span>
              </div>
            </div>
            <div className='w-full'>
              <Button
                variant='outline'
                type='button'
                disabled={isPending || isGoogleLoading}
                className='w-full'
                onClick={() => {
                  setIsGoogleLoading(true)
                  const popup = window.open(
                    AppApis.auth.googleAdmin,
                    'google-oauth',
                    'width=500,height=600'
                  )
                  if (!popup) {
                    setIsGoogleLoading(false)
                    toast.error(t('auth.popup_blocked'))
                    return
                  }
                  const handleMessage = (event: MessageEvent) => {
                    if (
                      event.origin !==
                      new URL(AppApis.auth.googleAdmin).origin
                    )
                      return
                    const {
                      accessToken,
                      accessTokenExpiresIn,
                      refreshToken,
                      refreshTokenExpiresIn,
                      error,
                    } = event.data
                    if (error) {
                      setIsGoogleLoading(false)
                      toast.error(
                        t('auth.admin_only')
                      )
                      window.removeEventListener('message', handleMessage)
                      return
                    }
                    if (!accessToken || !refreshToken) {
                      setIsGoogleLoading(false)
                      return
                    }
                    SetCookie('accessToken', accessToken, accessTokenExpiresIn)
                    SetCookie(
                      'refreshToken',
                      refreshToken,
                      refreshTokenExpiresIn
                    )
                    setIsGoogleLoading(false)
                    window.removeEventListener('message', handleMessage)
                    navigate({ to: '/' })
                  }
                  window.addEventListener('message', handleMessage)
                }}
              >
                {isGoogleLoading ? (
                  <Spinner />
                ) : (
                  <IconGoogle className='h-4 w-4' />
                )}{' '}
                Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
