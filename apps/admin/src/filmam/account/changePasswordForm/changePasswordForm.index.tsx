import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '@/data'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
  Spinner,
} from '@/utilities/components'

const changePasswordFormSchema = z
  .object({
    current_password: z.string().min(1, 'Please enter your current password.'),
    new_password: z.string().transform((pwd) => pwd.trim()),
    confirm_password: z.string(),
  })
  .refine(({ new_password }) => new_password.length >= 8, {
    message: 'Password must be at least 8 characters long.',
    path: ['new_password'],
  })
  .refine(({ new_password }) => /[a-z]/.test(new_password), {
    message: 'Password must contain at least one lowercase letter.',
    path: ['new_password'],
  })
  .refine(({ new_password }) => /\d/.test(new_password), {
    message: 'Password must contain at least one number.',
    path: ['new_password'],
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

const defaultValues: ChangePasswordFormValues = {
  current_password: '',
  new_password: '',
  confirm_password: '',
}

export function ChangePasswordForm() {
  const { t } = useTranslation()

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ current_password, new_password }: ChangePasswordFormValues) =>
      Api(AppApis.auth.changePassword, {
        method: 'PUT',
        body: { current_password, new_password },
      }),
    onSuccess: () => {
      toast.success(t('account.password_updated'))
      form.reset()
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='current_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.current_password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='new_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.new_password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='e.g., S3cur3P@ssw0rd' {...field} />
              </FormControl>
              <FormDescription>
                {t('account.change_password_desc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirm_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.confirm_password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='e.g., S3cur3P@ssw0rd' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? <Spinner /> : null} {t('account.update_password')}
        </Button>
      </form>
    </Form>
  )
}