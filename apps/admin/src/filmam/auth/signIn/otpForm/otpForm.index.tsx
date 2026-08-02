import { type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  Api,
  SetCookie,
  TranslateServerError,
  TimerParser,
  Cn,
} from '@/scripts'
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Spinner,
} from '@/utilities/components'
import { useMutation } from '@tanstack/react-query'
import { AppApis } from '@/data'
import { toast } from 'sonner'
import { type JWTTokenType } from '@/types'

type OtpFormProps = {
  email: string
  password: string
  setStep: Dispatch<SetStateAction<'Login' | 'Otp'>>
  className?: React.HTMLAttributes<HTMLFormElement>
  start: () => void
  stop: () => void
  reset: () => void
  timer: number
}

export function OtpForm({
  className,
  setStep,
  email,
  password,
  start,
  stop,
  reset,
  timer,
  ...props
}: OtpFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const formSchema = z.object({
    otp: z.string().min(5, t('auth.otp_required')).max(5, t('auth.otp_length')),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      email,
      password,
      otp,
    }: {
      email: string
      password: string
      otp: string
    }) =>
      Api<JWTTokenType>(AppApis.auth.adminLoginVerify, {
        method: 'POST',
        body: {
          email,
          password,
          otp,
        },
      }),
    onSuccess: (data) => {
      SetCookie('accessToken', data.accessToken, data.accessTokenExpiresIn)
      SetCookie('refreshToken', data.refreshToken, data.refreshTokenExpiresIn)

      toast.success(t('auth.login_successful'))
      navigate({ to: '/' })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const { mutate: loginMutate, isPending: loginIsPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      Api(AppApis.auth.adminLogin, {
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    onSuccess: () => {
      start()
      toast.success(t('auth.otp_resent'))
      form.resetField('otp')
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate({ ...data, email, password })
  }

  function editCredential() {
    reset()
    setStep('Login')
  }

  return (
    <Card className='w-full gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>
          {t('auth.otp_title')}
        </CardTitle>
        <CardDescription>
          {t('auth.otp_description').split('--')[0]} {email}{' '}
          {t('auth.otp_description').split('--')[1]}
          <div className='my-4 flex w-full items-center justify-between'>
            <Button
              variant='ghost'
              size='sm'
              type='button'
              onClick={editCredential}
            >
              {t('auth.edit_credential')}
            </Button>
            {timer > 0 ? (
              <p className='text-sm text-muted-foreground'>
                {t('auth.resend_timer', { timer: TimerParser(timer) })}
              </p>
            ) : (
              <Button
                variant='ghost'
                size='sm'
                type='button'
                onClick={() => loginMutate({ email, password })}
                disabled={loginIsPending}
              >
                {loginIsPending ? (
                  <>
                    <Spinner />
                    {t('auth.sending')}
                  </>
                ) : (
                  t('auth.resend')
                )}
              </Button>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={Cn('grid gap-2', className)}
            {...props}
          >
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.one_time_password')}</FormLabel>
                  <FormControl>
                    <div dir='ltr' style={{ direction: 'ltr' }}>
                      <InputOTP
                        maxLength={5}
                        autoFocus={true}
                        {...field}
                        containerClassName='w-full [&>[data-slot="input-otp-group"]]:w-full [&>[data-slot="input-otp-group"]>div]:flex-1 [&>[data-slot="input-otp-group"]>div]:h-12 [&>[data-slot="input-otp-group"]>div]:text-lg'
                      >
                        <InputOTPGroup className='w-full'>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={otp.length < 5 || isPending}>
              {isPending ? <Spinner /> : null}
              {t('auth.verify')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
