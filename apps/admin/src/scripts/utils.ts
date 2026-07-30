import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AppLanguagesEnum, MessageType } from '../types'
import { Api, RemoveCookie } from '.'
import { AppApis } from '../data'
import { useUserStore } from '../stores'

export function __Cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function __Sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function __GetPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5
  const rangeWithDots: (number | string)[] = []

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      rangeWithDots.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      rangeWithDots.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    }
  }

  return rangeWithDots
}

export function __GetDisplayNameInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  const first = parts[0][0] ?? ''
  const last = parts[parts.length - 1]?.[0] ?? ''
  return (first + last).toUpperCase()
}

export async function __LogOut() {
  await Api<MessageType>(AppApis.auth.logout, { method: 'POST' })
  useUserStore.getState().setUser(null)

  RemoveCookie('accessToken')
  RemoveCookie('refreshToken')
}

export async function __HashEmail(email: string) {
  const encoder = new TextEncoder()

  const data = encoder.encode(email)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))

  const hashedEmail = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return hashedEmail
}

export const __DefaultLanguage = AppLanguagesEnum.EN
export const __AppLanguages = ['FA', 'EN', 'AR']
