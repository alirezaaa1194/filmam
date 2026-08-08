import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Section } from '../sections.type'

type SectionsDialogType = 'add' | 'edit' | 'delete'

type SectionsContextType = {
  open: SectionsDialogType | null
  setOpen: (str: SectionsDialogType | null) => void
  currentRow: Section | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Section | null>>
}

const SectionsContext = React.createContext<SectionsContextType | null>(null)

export function SectionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SectionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Section | null>(null)
  return (
    <SectionsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SectionsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSections = () => {
  const sectionsContext = React.useContext(SectionsContext)
  if (!sectionsContext) {
    throw new Error('useSections has to be used within <SectionsContext>')
  }
  return sectionsContext
}
