import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type HeaderMenuItem } from '../headerMenus.type'

type HeaderMenusDialogType = 'add' | 'edit' | 'delete' | 'filters'

type HeaderMenusContextType = {
  open: HeaderMenusDialogType | null
  setOpen: (str: HeaderMenusDialogType | null) => void
  currentRow: HeaderMenuItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<HeaderMenuItem | null>>
}

const HeaderMenusContext = React.createContext<HeaderMenusContextType | null>(
  null
)

export function HeaderMenusProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<HeaderMenusDialogType>(null)
  const [currentRow, setCurrentRow] = useState<HeaderMenuItem | null>(null)

  return (
    <HeaderMenusContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </HeaderMenusContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useHeaderMenus = () => {
  const headerMenusContext = React.useContext(HeaderMenusContext)

  if (!headerMenusContext) {
    throw new Error('useHeaderMenus has to be used within <HeaderMenusContext>')
  }

  return headerMenusContext
}