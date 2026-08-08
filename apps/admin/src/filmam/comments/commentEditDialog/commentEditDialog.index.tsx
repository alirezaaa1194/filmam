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
import { type Comment, type UpdateCommentPayloadType } from '../comments.type'

type CommentEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Comment
}

const buildSchema = (t: (key: string) => string) =>
  z.object({
    body: z.string().min(1, t('comments.body_required')),
  })

type FormValues = z.infer<ReturnType<typeof buildSchema>>

export function CommentEditDialog({
  open,
  onOpenChange,
  currentRow,
}: CommentEditDialogProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: {
      body: currentRow.body,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      Api<UpdateCommentPayloadType>(AppApis.comment.adminUpdate(currentRow.id), {
        method: 'PUT',
        body: values,
      }),
    onSuccess: () => {
      toast.success(t('comments.comment_updated'))
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['comments'] })
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
          <DialogTitle>{t('comments.edit_comment')}</DialogTitle>
          <DialogDescription>
            {t('comments.edit_comment_desc')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='comment-edit-form'
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className='space-y-4 px-0.5'
          >
            <FormField
              control={form.control}
              name='body'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 pt-1.5 text-end'>
                    {t('comments.body')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
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
            form='comment-edit-form'
            disabled={isPending}
          >
            {isPending ? <Spinner /> : null} {t('comments.save_changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}