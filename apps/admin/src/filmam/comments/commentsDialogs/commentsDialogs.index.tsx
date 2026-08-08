import { CommentEditDialog } from '../commentEditDialog/commentEditDialog.index'
import { CommentsDeleteDialog } from '../commentsDeleteDialog/commentsDeleteDialog.index'
import { useComments } from '../commentsProvider/commentsProvider.index'

export function CommentsDialogs() {
  const { open, setOpen, currentRow } = useComments()
  return (
    <>
      {currentRow && (
        <>
          <CommentEditDialog
            key={`comment-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => setOpen('edit')}
            currentRow={currentRow}
          />
          <CommentsDeleteDialog
            key={`comment-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => setOpen('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
