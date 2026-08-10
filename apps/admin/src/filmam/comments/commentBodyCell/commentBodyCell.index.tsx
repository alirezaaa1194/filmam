import { type Row } from '@tanstack/react-table'
import { LongText } from '@/utilities/components'
import { useComments } from '../commentsProvider/commentsProvider.index'
import type { Comment } from '../comments.type'

export function CommentBodyCell({ row }: { row: Row<Comment> }) {
  const { setOpen, setCurrentRow } = useComments()
  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => {
        setCurrentRow(row.original)
        setOpen('view')
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setCurrentRow(row.original)
          setOpen('view')
        }
      }}
      className='cursor-pointer ps-3'
    >
      <LongText className='max-w-52 hover:underline'>
        {row.getValue('body')}
      </LongText>
    </div>
  )
}