import { AddSeasonDialog } from '../addSeasonDialog/addSeasonDialog.index'
import { EditSeasonDialog } from '../editSeasonDialog/editSeasonDialog.index'
import { SeasonsDeleteDialog } from '../seasonsDeleteDialog/seasonsDeleteDialog.index'
import { useSeasons } from '../seasonsProvider/seasonsProvider.index'

export function SeasonsDialogs() {
  const { open, setOpen, currentRow } = useSeasons()
  return (
    <>
      <AddSeasonDialog
        key='season-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <EditSeasonDialog
            key={`season-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => setOpen('edit')}
            currentRow={currentRow}
          />
          <SeasonsDeleteDialog
            key={`season-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => setOpen('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
