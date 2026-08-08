import { AddRoleDialog } from '../addRoleDialog/addRoleDialog.index'
import { EditRoleDialog } from '../editRoleDialog/editRoleDialog.index'
import { RolesDeleteDialog } from '../rolesDeleteDialog/rolesDeleteDialog.index'
import { useRoles } from '../rolesProvider/rolesProvider.index'

export function RolesDialogs() {
  const { open, setOpen, currentRow } = useRoles()
  return (
    <>
      <AddRoleDialog
        key='role-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditRoleDialog
            key={`role-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <RolesDeleteDialog
            key={`role-delete-${currentRow.id}`}
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
