import { AddGenreDialog } from '../addGenreDialog/addGenreDialog.index'
import { EditGenreDialog } from '../editGenreDialog/editGenreDialog.index'
import { GenresDeleteDialog } from '../genresDeleteDialog/genresDeleteDialog.index'
import { useGenres } from '../genresProvider/genresProvider.index'

export function GenresDialogs() {
  const { open, setOpen, currentRow } = useGenres()
  return (
    <>
      <AddGenreDialog
        key='genre-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditGenreDialog
            key={`genre-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <GenresDeleteDialog
            key={`genre-delete-${currentRow.id}`}
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
