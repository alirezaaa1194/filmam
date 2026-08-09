import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/utilities/components'
import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Api, TranslateServerError } from '@/scripts'
import { AppApis } from '../../../data'
import {
  type Comment,
  type UpdateCommentStatusPayloadType,
} from '../comments.type'
import { useComments } from '../commentsProvider/commentsProvider.index'

type DataTableRowActionsProps = {
  row: Row<Comment>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const queryclient = useQueryClient()
  const { setOpen, setCurrentRow } = useComments()
  const currentRow = row.original

  const openWithCurrentComment = (dialog: 'edit' | 'delete') => {
    setCurrentRow(currentRow)
    setOpen(dialog)
  }

  const { mutate: changeStatus } = useMutation({
    mutationFn: (status: UpdateCommentStatusPayloadType['status']) =>
      Api<UpdateCommentStatusPayloadType>(
        AppApis.comment.adminUpdateStatus(currentRow.id),
        {
          method: 'PUT',
          body: { status },
        }
      ),
    onSuccess: () => {
      toast.success(t('comments.comment_status_updated'))
      queryclient.invalidateQueries({ queryKey: ['comments'] })
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)))
    },
  })

  const isPending = currentRow.status === 'PENDING'

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>{t('comments.open_menu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem onClick={() => openWithCurrentComment('edit')}>
          {t('comments.edit')}
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {isPending && (
          <>
            <DropdownMenuItem onClick={() => changeStatus('APPROVED')}>
              {t('comments.approve')}
              <DropdownMenuShortcut>
                <CheckCircle2 size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeStatus('REJECTED')}>
              {t('comments.reject')}
              <DropdownMenuShortcut>
                <XCircle size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openWithCurrentComment('delete')}
          className='text-red-500!'
        >
          {t('common.delete')}
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}