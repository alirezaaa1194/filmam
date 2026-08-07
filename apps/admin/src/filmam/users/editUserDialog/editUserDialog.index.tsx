'use client'

import { useEffect } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@/utilities/components'

import { type User } from '../users.type'
import { AppLanguagesEnum } from '../../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppApis } from '../../../data'
import { toast } from 'sonner'

type UserEditDialogProps = {
  currentRow: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({
  currentRow,
  open,
  onOpenChange,
}: UserEditDialogProps) {
  const { t } = useTranslation()

  const formSchema = z.object({
    username: z
      .string()
      .min(1, t('users.username_required'))
      .min(3, t('users.username_min_length')),
    preferred_language: z.enum(AppLanguagesEnum),
  })

  type UserForm = z.infer<typeof formSchema>

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentRow.username,
      preferred_language: (currentRow.preferred_language || 'EN') as UserForm['preferred_language'],
    },
  })
  const queryclient = useQueryClient()

  useEffect(() => {
    if (open) {
      form.reset({
        username: currentRow.username,
        preferred_language: (currentRow.preferred_language ||
          'EN') as UserForm['preferred_language'],
      })
    }
  }, [open, currentRow, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UserForm) =>
      Api(AppApis.user.adminUpdate(Number(currentRow.id)), {
        method: 'PUT',
        body: data,
      }),
    onSuccess: () => {
      toast.success(t('users.user_updated'))
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
          <DialogTitle>{t('users.edit_user')}</DialogTitle>
          <DialogDescription>{t('users.edit_user_desc')}</DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-edit-form'
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
                      <Input className='col-span-4' {...field} />
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
                        value={field.value}
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
                <Button type='submit' form='user-edit-form' disabled={isPending}>
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