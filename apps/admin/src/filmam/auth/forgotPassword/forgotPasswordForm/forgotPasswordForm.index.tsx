import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Cn, Api, TranslateServerError } from '@/scripts'
import { useDirection } from '@/context'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from '@/utilities/components'
import { useMutation } from '@tanstack/react-query'
import { ApiErrorType, MessageType } from '@/types'
import { AppApis } from '@/data'

type ForgotPasswordFormPropsType = {
  className?: string
  redirectTo?: string
  setStep: Dispatch<SetStateAction<'Email' | 'Otp'>>
  setEmail: Dispatch<SetStateAction<string>>
  start: () => void
}

export function ForgotPasswordForm({
  className,
  setStep,
  setEmail,
  start,
  ...props
}: ForgotPasswordFormPropsType) {
  const { t } = useTranslation()
  const { dir } = useDirection()

  const formSchema = z.object({
    email: z.email({
      error: (iss) => (iss.input === '' ? t('auth.email_required') : undefined),
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email }: { email: string }) =>
      Api<MessageType>(AppApis.auth.adminForgetPassword, {
        method: 'POST',
        body: {
          email,
        },
      }),
    onSuccess: () => {
      toast.success(t('auth.otp_sent'))
      setEmail(form.getValues('email'))
      start()
      setStep('Otp')
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
          {t('auth.forgot_password')}
        </CardTitle>
        <CardDescription>
          {t('auth.forgot_password_description')}
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.email_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isPending}>
              {t('common.continue')}
              {isPending ? <Spinner /> : dir === 'rtl' ? <ArrowLeft /> : <ArrowRight />}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className='mx-auto px-8 text-center text-sm text-balance text-muted-foreground'>
          <Link
            to='/sign-in'
            className='underline underline-offset-4 hover:text-primary'
          >
            {t('auth.back_to_sign_in')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
