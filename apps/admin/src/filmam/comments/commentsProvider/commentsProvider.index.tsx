import React, { useState } from 'react'
import useDialogState from '@/hooks'
import { type Comment } from '../comments.type'

type CommentsDialogType = 'edit' | 'delete'

type CommentsContextType = {
  open: CommentsDialogType | null
  setOpen: (str: CommentsDialogType | null) => void
  currentRow: Comment | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Comment | null>>
}

const CommentsContext = React.createContext<CommentsContextType | null>(null)

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CommentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Comment | null>(null)
  return (
    <CommentsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CommentsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useComments = () => {
  const commentsContext = React.useContext(CommentsContext)
  if (!commentsContext) {
    throw new Error('useComments has to be used within <CommentsContext>')
  }
  return commentsContext
}
