'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Api, TranslateServerError } from '@/scripts'
import { KeyRound } from 'lucide-react'
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
  PasswordInput,
  Spinner,
} from '@/utilities/components'

import { type User } from '../users.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppApis } from '../../../data'
import { toast } from 'sonner'

type UserChangePasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersChangePasswordDialog({
  open,
  onOpenChange,
  currentRow,
}: UserChangePasswordDialogProps) {
  const { t } = useTranslation()

  const formSchema = z
    .object({
      new_password: z.string().transform((pwd) => pwd.trim()),
      confirm_password: z.string(),
    })
    .refine(
      ({ new_password }) => new_password.length >= 8,
      {
        message: t('users.password_min_length'),
        path: ['new_password'],
      }
    )
    .refine(
      ({ new_password }) => /[a-z]/.test(new_password),
      {
        message: t('users.password_lowercase'),
        path: ['new_password'],
      }
    )
    .refine(
      ({ new_password }) => /\d/.test(new_password),
      {
        message: t('users.password_number'),
        path: ['new_password'],
      }
    )
    .refine(
      (data) => data.new_password === data.confirm_password,
      {
        message: t('users.password_mismatch'),
        path: ['confirm_password'],
      }
    )

  type UserPasswordForm = z.infer<typeof formSchema>

  const form = useForm<UserPasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: ({ new_password }: UserPasswordForm) =>
      Api(AppApis.user.adminChangePassword(Number(currentRow.id)), {
        method: 'PUT',
        body: { new_password },
      }),
    onSuccess: () => {
      toast.success(t('users.password_changed'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: UserPasswordForm) => {
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
          <DialogTitle>
            <KeyRound className='me-1 inline-block' size={18} />{' '}
            {t('users.change_password')}
          </DialogTitle>
          <DialogDescription>
            {t('users.change_password_desc', {
              username: currentRow.username,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-change-password-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='new_password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('users.new_password')}
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
                name='confirm_password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('users.confirm_password')}
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
              <DialogFooter>
                <Button
                  type='submit'
                  form='user-change-password-form'
                  disabled={isPending}
                >
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