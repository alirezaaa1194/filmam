import { AddTagDialog } from '../addTagDialog/addTagDialog.index'
import { EditTagDialog } from '../editTagDialog/editTagDialog.index'
import { TagsDeleteDialog } from '../tagsDeleteDialog/tagsDeleteDialog.index'
import { useTags } from '../tagsProvider/tagsProvider.index'

export function TagsDialogs() {
  const { open, setOpen, currentRow } = useTags()
  return (
    <>
      <AddTagDialog
        key='tag-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditTagDialog
            key={`tag-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <TagsDeleteDialog
            key={`tag-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
