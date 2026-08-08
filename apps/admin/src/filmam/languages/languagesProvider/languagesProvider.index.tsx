import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Language } from '../languages.type'

type LanguagesDialogType = 'add' | 'edit' | 'delete'

type LanguagesContextType = {
  open: LanguagesDialogType | null
  setOpen: (str: LanguagesDialogType | null) => void
  currentRow: Language | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Language | null>>
}

const LanguagesContext = React.createContext<LanguagesContextType | null>(null)

export function LanguagesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LanguagesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Language | null>(null)

  return (
    <LanguagesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LanguagesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguages = () => {
  const languagesContext = React.useContext(LanguagesContext)

  if (!languagesContext) {
    throw new Error('useLanguages has to be used within <LanguagesContext>')
  }

  return languagesContext
}
