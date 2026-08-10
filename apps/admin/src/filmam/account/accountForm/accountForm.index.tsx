import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Api, AppLanguages, DefaultLanguage, TranslateServerError } from '@/scripts'
import { AppApis } from '@/data'
import { AppLanguagesEnum } from '@/types'
import { useUserStore } from '@/stores'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@/utilities/components'

const accountFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Please enter your username.')
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  preferred_language: z.enum(AppLanguagesEnum),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { t } = useTranslation()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const queryClient = useQueryClient()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: user?.username ?? '',
      preferred_language: (user?.preferred_language ??
        DefaultLanguage) as AccountFormValues['preferred_language'],
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        preferred_language: user.preferred_language as AccountFormValues['preferred_language'],
      })
    }
  }, [user, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AccountFormValues) =>
      Api(AppApis.user.updateInfo, { method: 'PUT', body: data }),
    onSuccess: () => {
      toast.success(t('account.account_updated'))
      if (user) {
        setUser({ ...user, ...form.getValues() })
      }
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: AccountFormValues) => {
    mutate(values)
  }

  if (!user) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.username')}</FormLabel>
              <FormControl>
                <Input placeholder={t('account.username_placeholder')} {...field} />
              </FormControl>
              <FormDescription>{t('account.username_desc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>{t('account.email')}</FormLabel>
          <FormControl>
            <Input value={user.email} disabled />
          </FormControl>
          <FormDescription>{t('account.email_desc')}</FormDescription>
        </FormItem>
        <FormField
          control={form.control}
          name='preferred_language'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.preferred_language')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className='w-50'>
                    <SelectValue placeholder={t('account.language_placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AppLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {t(`header_menus.languages.${lang}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t('account.preferred_language_desc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? <Spinner /> : null} {t('account.update_account')}
        </Button>
      </form>
    </Form>
  )
}