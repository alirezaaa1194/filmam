import { AddFactorDialog } from '../addFactorDialog/addFactorDialog.index'
import { EditFactorDialog } from '../editFactorDialog/editFactorDialog.index'
import { FactorsDeleteDialog } from '../factorsDeleteDialog/factorsDeleteDialog.index'
import { useFactors } from '../factorsProvider/factorsProvider.index'

export function FactorsDialogs() {
  const { open, setOpen, currentRow } = useFactors()
  return (
    <>
      <AddFactorDialog
        key='factor-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditFactorDialog
            key={`factor-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <FactorsDeleteDialog
            key={`factor-delete-${currentRow.id}`}
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
