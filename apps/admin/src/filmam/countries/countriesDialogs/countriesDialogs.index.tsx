import { AddCountryDialog } from '../addCountryDialog/addCountryDialog.index'
import { CountriesDeleteDialog } from '../countriesDeleteDialog/countriesDeleteDialog.index'
import { useCountries } from '../countriesProvider/countriesProvider.index'
import { EditCountryDialog } from '../editCountryDialog/editCountryDialog.index'

export function CountriesDialogs() {
  const { open, setOpen, currentRow } = useCountries()
  return (
    <>
      <AddCountryDialog
        key='country-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <EditCountryDialog
            key={`country-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
            }}
            currentRow={currentRow}
          />

          <CountriesDeleteDialog
            key={`country-delete-${currentRow.id}`}
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
