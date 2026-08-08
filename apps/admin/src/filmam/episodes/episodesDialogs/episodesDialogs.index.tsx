import { AddEpisodeDialog } from '../addEpisodeDialog/addEpisodeDialog.index'
import { EditEpisodeDialog } from '../editEpisodeDialog/editEpisodeDialog.index'
import { EpisodesDeleteDialog } from '../episodesDeleteDialog/episodesDeleteDialog.index'
import { useEpisodes } from '../episodesProvider/episodesProvider.index'

export function EpisodesDialogs() {
  const { open, setOpen, currentRow } = useEpisodes()
  return (
    <>
      <AddEpisodeDialog
        key='episode-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <EditEpisodeDialog
            key={`episode-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => setOpen('edit')}
            currentRow={currentRow}
          />
          <EpisodesDeleteDialog
            key={`episode-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => setOpen('delete')}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
