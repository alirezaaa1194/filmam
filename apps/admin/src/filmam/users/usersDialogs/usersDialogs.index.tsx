import { AddUserDialog } from '../addUserDialog/addUserDialog.index'
import { EditUserDialog } from '../editUserDialog/editUserDialog.index'
import { UsersBlockDialog } from '../usersBlockDialog/usersBlockDialog.index'
import { UsersChangePasswordDialog } from '../usersChangePasswordDialog/usersChangePasswordDialog.index'
import { UsersChangeRoleDialog } from '../usersChangeRoleDialog/usersChangeRoleDialog.index'
import { UsersDeleteDialog } from '../usersDeleteDialog/usersDeleteDialog.index'
import { useUsers } from '../usersProvider/usersProvider.index'

export function UsersDialogs() {
  const { open, setOpen, currentRow } = useUsers()
  return (
    <>
      <AddUserDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditUserDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
            }}
            currentRow={currentRow}
          />

          <UsersChangeRoleDialog
            key={`user-change-role-${currentRow.id}`}
            open={open === 'change-role'}
            onOpenChange={() => {
              setOpen('change-role')
            }}
            currentRow={currentRow}
          />

          <UsersChangePasswordDialog
            key={`user-change-password-${currentRow.id}`}
            open={open === 'change-password'}
            onOpenChange={() => {
              setOpen('change-password')
            }}
            currentRow={currentRow}
          />

          <UsersBlockDialog
            key={`user-block-${currentRow.id}`}
            open={open === 'block'}
            onOpenChange={() => {
              setOpen('block')
            }}
            users={[currentRow]}
          />
        </>
      )}
    </>
  )
}