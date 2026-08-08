import { AddMovieDialog } from '../addMovieDialog/addMovieDialog.index'
import { EditMovieDialog } from '../editMovieDialog/editMovieDialog.index'
import { MoviesDeleteDialog } from '../moviesDeleteDialog/moviesDeleteDialog.index'
import { useMovies } from '../moviesProvider/moviesProvider.index'

export function MoviesDialogs() {
  const { open, setOpen, currentRow } = useMovies()
  return (
    <>
      <AddMovieDialog
        key='movie-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditMovieDialog
            key={`movie-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <MoviesDeleteDialog
            key={`movie-delete-${currentRow.id}`}
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
