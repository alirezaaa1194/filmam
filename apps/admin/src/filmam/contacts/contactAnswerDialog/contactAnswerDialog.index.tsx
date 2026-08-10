'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  Spinner,
  Textarea,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import type { Contact } from '../contacts.type'

type ContactAnswerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Contact
}

const buildSchema = (t: (key: string) => string) =>
  z.object({
    answer_message: z.string().min(1, t('contacts.answer_message_required')),
  })

type FormValues = z.infer<ReturnType<typeof buildSchema>>

export function ContactAnswerDialog({
  open,
  onOpenChange,
  currentRow,
}: ContactAnswerDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: {
      answer_message: currentRow.answer_message ?? '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      Api(AppApis.contact.adminAnswer(currentRow.id), {
        method: 'PUT',
        body: values,
      }),
    onSuccess: () => {
      toast.success(t('contacts.contact_answered'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['contacts'] })
      queryclient.invalidateQueries({ queryKey: ['notification'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) onOpenChange(false)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('contacts.answer_contact')}</DialogTitle>
          <DialogDescription>
            {t('contacts.answer_contact_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3 rounded-lg border bg-muted/40 p-3'>
          <p className='text-sm font-medium'>{currentRow.user_email}</p>
          <p className='text-sm text-muted-foreground'>{currentRow.message}</p>
        </div>
        <Form {...form}>
          <form
            id='contact-answer-form'
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className='space-y-4 px-0.5'
          >
            <FormField
              control={form.control}
              name='answer_message'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 pt-1.5 text-end'>
                    {t('contacts.answer_message')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={t('contacts.answer_message_placeholder')}
                      className='col-span-4 resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='contact-answer-form'
            disabled={isPending}
          >
            {isPending ? <Spinner /> : null} {t('contacts.save_changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
