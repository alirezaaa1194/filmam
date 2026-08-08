'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
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
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  roleTabLanguageOrder,
  roleTypes,
} from '../roles.data'
import type { CreateRolePayloadType } from '../roles.type'

type RoleAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRoleDialog({ open, onOpenChange }: RoleAddDialogProps) {
  const { t } = useTranslation()

  const formSchema = z.object({
    slug: z
      .string()
      .min(1, t('roles.slug_required'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('roles.slug_invalid')),
    type: z.enum(['CREATOR', 'ACTOR']),
    translations: z.array(
      z.object({
        lang: z.enum(AppLanguagesEnum),
        name: z.string().min(1, t('roles.name_required')),
      })
    ),
  })

  type RoleForm = z.infer<typeof formSchema>

  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: '',
      type: 'CREATOR',
      translations: roleTabLanguageOrder.map(
        (lang) =>
          ({
            lang: lang as RoleForm['translations'][number]['lang'],
            name: '',
          }) as RoleForm['translations'][number]
      ),
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'translations',
  })
  const queryclient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RoleForm) =>
      Api(AppApis.role.adminCreate, {
        method: 'POST',
        body: {
          slug: data.slug,
          type: data.type,
          translations: data.translations.map(({ lang, name }) => ({
            lang,
            name,
          })),
        } satisfies CreateRolePayloadType,
      }),
    onSuccess: () => {
      toast.success(t('roles.role_created'))
      form.reset()
      onOpenChange(false)
      queryclient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const onSubmit = (values: RoleForm) => {
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
          <DialogTitle>{t('roles.add_role')}</DialogTitle>
          <DialogDescription>{t('roles.add_role_desc')}</DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='role-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('roles.slug')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., director'
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
                name='type'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      {t('roles.type')}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='col-span-4'>
                          <SelectValue placeholder={t('roles.select_type')} />
                        </SelectTrigger>
                        <SelectContent>
                          {roleTypes.map(({ labelKey, value }) => (
                            <SelectItem key={value} value={value}>
                              {t(labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <Tabs
                defaultValue={roleTabLanguageOrder[0]}
                className='col-span-6'
              >
                <TabsList className='w-full'>
                  {fields.map((field) => (
                    <TabsTrigger
                      key={field.id}
                      value={field.lang}
                      className='flex-1'
                    >
                      {t(`roles.languages.${field.lang}`)}
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
                      name={`translations.${index}.name`}
                      render={({ field: nameField }) => (
                        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                          <FormLabel className='col-span-2 text-end'>
                            {t('roles.name')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('roles.name_placeholder')}
                              dir={getLanguageDirection(field.lang)}
                              className={Cn(
                                'col-span-4',
                                getLanguageFontClass(field.lang)
                              )}
                              {...nameField}
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
                <Button type='submit' form='role-form' disabled={isPending}>
                  {isPending ? <Spinner /> : null} {t('roles.save_changes')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
