'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/utilities/components'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, Cn, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import { AppLanguagesEnum } from '../../../types'
import {
  getLanguageDirection,
  getLanguageFontClass,
  tagsTabLanguageOrder,
} from '../tags.data'
import {
  type CreateTagPayloadType,
  type Tag,
  type TagDetailType,
} from '../tags.type'
import { TagDialogSkeleton } from './tagDialogSkeleton.index'

type TagEditDialogProps = {
  currentRow: Tag
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTagDialog({
  currentRow,
  open,
  onOpenChange,
}: TagEditDialogProps) {
  const { t } = useTranslation()

  const {
    data: tagDetail,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['tags-detail', currentRow.id],
    queryFn: () =>
      Api<TagDetailType>(AppApis.tag.adminById(currentRow.id), {
        method: 'GET',
      }),
    enabled: open,
    staleTime: 0,
  })

  const isLoading = isPending || isFetching || !tagDetail

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('tags.edit_tag')}</DialogTitle>
          <DialogDescription>{t('tags.edit_tag_desc')}</DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          {isLoading ? (
            <TagDialogSkeleton />
          ) : (
            <TagEditForm tagDetail={tagDetail} onOpenChange={onOpenChange} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TagEditForm({
  tagDetail,
  onOpenChange,
}: {
  tagDetail: TagDetailType
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()

  const formSchema = z.object({
    slug: z
      .string()
      .min(1, t('tags.slug_required'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('tags.slug_invalid')),
    translations: z.array(
      z.object({
        lang: z.enum(AppLanguagesEnum),
        label: z.string().min(1, t('tags.label_required')),
      })
    ),
  })

  type TagForm = z.infer<typeof formSchema>

  const form = useForm<TagForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: tagDetail.slug,
      translations: tagsTabLanguageOrder.map(
        (lang) =>
          ({
            lang: lang as TagForm['translations'][number]['lang'],
            label:
              tagDetail.translations.find(
                (translation) => translation.language === lang
              )?.label ?? '',
          }) as TagForm['translations'][number]
      ),
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TagForm) =>
      Api(AppApis.tag.adminUpdate(tagDetail.id), {
        method: 'PUT',
        body: {
          slug: data.slug,
          translations: data.translations.map(({ lang, label }) => ({
            lang,
            label,
          })),
        } satisfies CreateTagPayloadType,
      }),
    onSuccess: () => {
      toast.success(t('tags.tag_updated'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['tags'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: TagForm) => {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        id='tag-edit-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-0.5'
      >
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                {t('tags.slug')}
              </FormLabel>
              <FormControl>
                <Input className='col-span-4' {...field} />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />

        <Tabs defaultValue={tagsTabLanguageOrder[0]} className='col-span-6'>
          <TabsList className='w-full'>
            {fields.map((field) => (
              <TabsTrigger key={field.id} value={field.lang} className='flex-1'>
                {t(`tags.languages.${field.lang}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {fields.map((field, index) => (
            <TabsContent
              key={field.id}
              value={field.lang}
              className='mt-2 space-y-4'
            >
              <FormField
                key={field.id}
                control={form.control}
                name={`translations.${index}.label`}
                render={({ field: labelField }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('tags.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('tags.label_placeholder')}
                        dir={getLanguageDirection(field.lang)}
                        className={Cn(
                          'col-span-4',
                          getLanguageFontClass(field.lang)
                        )}
                        {...labelField}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter>
          <Button type='submit' form='tag-edit-form' disabled={isPending}>
            {isPending ? <Spinner /> : null} {t('tags.save_changes')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
