import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Factor } from '../factors.type'

type FactorsDialogType = 'add' | 'edit' | 'delete'

type FactorsContextType = {
  open: FactorsDialogType | null
  setOpen: (str: FactorsDialogType | null) => void
  currentRow: Factor | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Factor | null>>
}

const FactorsContext = React.createContext<FactorsContextType | null>(null)

export function FactorsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<FactorsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Factor | null>(null)

  return (
    <FactorsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </FactorsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFactors = () => {
  const factorsContext = React.useContext(FactorsContext)

  if (!factorsContext) {
    throw new Error('useFactors has to be used within <FactorsContext>')
  }

  return factorsContext
}
