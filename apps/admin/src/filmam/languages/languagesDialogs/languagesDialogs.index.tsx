import { AddLanguageDialog } from '../addLanguageDialog/addLanguageDialog.index'
import { EditLanguageDialog } from '../editLanguageDialog/editLanguageDialog.index'
import { LanguagesDeleteDialog } from '../languagesDeleteDialog/languagesDeleteDialog.index'
import { useLanguages } from '../languagesProvider/languagesProvider.index'

export function LanguagesDialogs() {
  const { open, setOpen, currentRow } = useLanguages()
  return (
    <>
      <AddLanguageDialog
        key='language-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditLanguageDialog
            key={`language-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <LanguagesDeleteDialog
            key={`language-delete-${currentRow.id}`}
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
