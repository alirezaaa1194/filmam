import { createContext, useContext, useEffect, useState } from 'react'
import { DirectionProvider as RdxDirProvider } from '@radix-ui/react-direction'
import { GetCookie, SetCookie, RemoveCookie } from '@/scripts'
import type { Direction } from '@/types'

const DEFAULT_DIRECTION = 'ltr'
const DIRECTION_COOKIE_NAME = 'dir'
const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type DirectionContextType = {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextType | null>(null)

export function __DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, _setDir] = useState<Direction>(
    () => (GetCookie(DIRECTION_COOKIE_NAME) as Direction) || DEFAULT_DIRECTION
  )

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('dir', dir)
  }, [dir])

  const setDir = (dir: Direction) => {
    _setDir(dir)
    SetCookie(DIRECTION_COOKIE_NAME, dir, DIRECTION_COOKIE_MAX_AGE)
  }

  const resetDir = () => {
    _setDir(DEFAULT_DIRECTION)
    RemoveCookie(DIRECTION_COOKIE_NAME)
  }

  return (
    <DirectionContext
      value={{
        defaultDir: DEFAULT_DIRECTION,
        dir,
        setDir,
        resetDir,
      }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function __useDirection() {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}
