import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Episode } from '../episodes.type'

type EpisodesDialogType = 'add' | 'edit' | 'delete'

type EpisodesContextType = {
  open: EpisodesDialogType | null
  setOpen: (str: EpisodesDialogType | null) => void
  currentRow: Episode | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Episode | null>>
}

const EpisodesContext = React.createContext<EpisodesContextType | null>(null)

export function EpisodesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<EpisodesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Episode | null>(null)
  return (
    <EpisodesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EpisodesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEpisodes = () => {
  const episodesContext = React.useContext(EpisodesContext)
  if (!episodesContext) {
    throw new Error('useEpisodes has to be used within <EpisodesContext>')
  }
  return episodesContext
}
