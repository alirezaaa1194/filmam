import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Season } from '../seasons.type'

type SeasonsDialogType = 'add' | 'edit' | 'delete'

type SeasonsContextType = {
  open: SeasonsDialogType | null
  setOpen: (str: SeasonsDialogType | null) => void
  currentRow: Season | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Season | null>>
}

const SeasonsContext = React.createContext<SeasonsContextType | null>(null)

export function SeasonsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SeasonsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Season | null>(null)
  return (
    <SeasonsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SeasonsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSeasons = () => {
  const seasonsContext = React.useContext(SeasonsContext)
  if (!seasonsContext) {
    throw new Error('useSeasons has to be used within <SeasonsContext>')
  }
  return seasonsContext
}
