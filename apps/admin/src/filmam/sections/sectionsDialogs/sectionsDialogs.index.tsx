import { AddSectionDialog } from '../addSectionDialog/addSectionDialog.index'
import { EditSectionDialog } from '../editSectionDialog/editSectionDialog.index'
import { SectionsDeleteDialog } from '../sectionsDeleteDialog/sectionsDeleteDialog.index'
import { useSections } from '../sectionsProvider/sectionsProvider.index'

export function SectionsDialogs() {
  const { open, setOpen, currentRow } = useSections()
  return (
    <>
      <AddSectionDialog
        key='section-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <EditSectionDialog
            key={`section-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => setOpen('edit')}
            currentRow={currentRow}
          />
          <SectionsDeleteDialog
            key={`section-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => setOpen('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
