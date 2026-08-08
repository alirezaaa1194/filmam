import { AddHeaderMenuDialog } from '../addHeaderMenuDialog/addHeaderMenuDialog.index'
import { EditHeaderMenuDialog } from '../editHeaderMenuDialog/editHeaderMenuDialog.index'
import { HeaderMenusDeleteDialog } from '../headerMenusDeleteDialog/headerMenusDeleteDialog.index'
import { useHeaderMenus } from '../headerMenusProvider/headerMenusProvider.index'

export function HeaderMenusDialogs() {
  const { open, setOpen, currentRow } = useHeaderMenus()
  return (
    <>
      <AddHeaderMenuDialog
        key='header-menu-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditHeaderMenuDialog
            key={`header-menu-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <HeaderMenusDeleteDialog
            key={`header-menu-delete-${currentRow.id}`}
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
