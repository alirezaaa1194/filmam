'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Api, AppLanguages, TranslateServerError } from '@/scripts'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@/utilities/components'

import { AppLanguagesEnum } from '../../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppApis } from '../../../data'
import { toast } from 'sonner'

type UserAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: UserAddDialogProps) {
  const { t } = useTranslation()

  const formSchema = z
    .object({
      username: z
        .string()
        .min(1, t('users.username_required'))
        .min(3, t('users.username_min_length')),
      email: z.email({
        error: (iss) =>
          iss.input === '' ? t('users.email_required') : undefined,
      }),
      password: z.string().transform((pwd) => pwd.trim()),
      preferred_language: z.enum(AppLanguagesEnum).optional(),
    })
    .refine(
      (data) => {
        return data.password.length > 0
      },
      {
        message: t('users.password_required'),
        path: ['password'],
      }
    )
    .refine(
      ({ password }) => {
        return password.length >= 8
      },
      {
        message: t('users.password_min_length'),
        path: ['password'],
      }
    )
    .refine(
      ({ password }) => {
        return /[a-z]/.test(password)
      },
      {
        message: t('users.password_lowercase'),
        path: ['password'],
      }
    )
    .refine(
      ({ password }) => {
        return /\d/.test(password)
      },
      {
        message: t('users.password_number'),
        path: ['password'],
      }
    )

  type UserForm = z.infer<typeof formSchema>

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UserForm) =>
      Api(AppApis.user.adminCreate, { method: 'POST', body: data }),
    onSuccess: () => {
      toast.success(t('users.user_created'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: UserForm) => {
    mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('users.add_user')}</DialogTitle>
          <DialogDescription>{t('users.add_user_desc')}</DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('users.username')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john_doe'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('users.email')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('users.password')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='preferred_language'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('users.preferred_language')}
                    </FormLabel>

                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className='col-span-4'>
                          <SelectValue placeholder={t('users.select_language')} />
                        </SelectTrigger>

                        <SelectContent>
                          {AppLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit' form='user-form' disabled={isPending}>
                  {isPending ? <Spinner /> : null} {t('users.save_changes')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
