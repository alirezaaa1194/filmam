import { create } from 'zustand'
import type { UserState } from '@/types'

export const __useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
