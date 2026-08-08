import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Country } from '../countries.type'

type CountriesDialogType = 'add' | 'edit' | 'delete'

type CountriesContextType = {
  open: CountriesDialogType | null
  setOpen: (str: CountriesDialogType | null) => void
  currentRow: Country | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Country | null>>
}

const CountriesContext = React.createContext<CountriesContextType | null>(null)

export function CountriesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CountriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Country | null>(null)

  return (
    <CountriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CountriesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCountries = () => {
  const countriesContext = React.useContext(CountriesContext)

  if (!countriesContext) {
    throw new Error('useCountries has to be used within <CountriesContext>')
  }

  return countriesContext
}
