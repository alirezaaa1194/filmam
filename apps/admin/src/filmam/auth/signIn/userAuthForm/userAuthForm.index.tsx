import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { Cn, Api, SetCookie } from '@/scripts'
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
} from '@/utilities/components'
import { useMutation } from '@tanstack/react-query'
import { AppApis } from '@/data'
import { IconGoogle } from '@/assets/brand-icons/icon-google'
import { ApiErrorType } from '@/types'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
  setStep: Dispatch<SetStateAction<'Login' | 'Otp'>>
  setEmail: Dispatch<SetStateAction<string>>
  setPassword: Dispatch<SetStateAction<string>>
  start: () => void
}

export function UserAuthForm({
  className,
  redirectTo,
  setStep,
  setEmail,
  setPassword,
  start,
  ...props
}: UserAuthFormProps) {
  const { t } = useTranslation()
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      Api(AppApis.auth.login, {
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
    onError: (data: ApiErrorType) => {
      toast.error(data.errors[0].detail)
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
            <Button className='mt-2' disabled={isPending}>
              {isPending ? <Loader2 className='animate-spin' /> : <LogIn />}
              {t('auth.sign_in')}
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
                disabled={isPending}
                className='w-full'
                onClick={() => {
                  const popup = window.open(
                    AppApis.auth.google,
                    'google-oauth',
                    'width=500,height=600'
                  )
                  if (!popup) {
                    toast.error('Popup blocked. Please allow popups for this site.')
                    return
                  }
                  const handleMessage = (event: MessageEvent) => {
                    if (event.origin !== new URL(AppApis.auth.google).origin) return
                    const { accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn } = event.data
                    if (!accessToken || !refreshToken) return
                    SetCookie('accessToken', accessToken, accessTokenExpiresIn)
                    SetCookie('refreshToken', refreshToken, refreshTokenExpiresIn)
                    window.removeEventListener('message', handleMessage)
                    navigate({ to: '/' })
                  }
                  window.addEventListener('message', handleMessage)
                }}
              >
                <IconGoogle className='h-4 w-4' />{' '}
                {t('auth_providers.facebook')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
