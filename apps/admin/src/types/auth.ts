export interface __AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

export interface __AuthState {
  auth: {
    user: __AuthUser | null
    setUser: (user: __AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}
