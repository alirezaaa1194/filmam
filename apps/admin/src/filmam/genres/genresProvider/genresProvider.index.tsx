import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Genre } from '../genres.type'

type GenresDialogType = 'add' | 'edit' | 'delete'

type GenresContextType = {
  open: GenresDialogType | null
  setOpen: (str: GenresDialogType | null) => void
  currentRow: Genre | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Genre | null>>
}

const GenresContext = React.createContext<GenresContextType | null>(null)

export function GenresProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<GenresDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Genre | null>(null)

  return (
    <GenresContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </GenresContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGenres = () => {
  const genresContext = React.useContext(GenresContext)

  if (!genresContext) {
    throw new Error('useGenres has to be used within <GenresContext>')
  }

  return genresContext
}
