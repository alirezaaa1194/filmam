import { LogOut } from '@/scripts'
import { AppApis } from '../data'
import i18n from '../i18n'
import type { ApiQueryType } from '../types'

let refreshPromise: Promise<Response> | null = null

async function refreshTokens(): Promise<Response> {
  return fetch(AppApis.auth.refresh, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
  })
}

export const __ClientCall = async <T>(
  url: string,
  options: {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT'
    body?: unknown
    query?: Record<string, unknown> | ApiQueryType
  },
  retry = true
): Promise<T> => {
  const currentLanguage = i18n.resolvedLanguage
  let queryString = ''

  if (options.query) {
    const queryParams = new URLSearchParams()
    for (const key in options.query) {
      const value = options.query[key as keyof ApiQueryType]
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    }
    queryString = `&${queryParams.toString()}`
  }
  const response = await fetch(`${url}?lang=${currentLanguage}${queryString}`, {
    ...options,
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'content-type': 'application/json',
    },
  })

  if (
    response.status === 401 &&
    retry &&
    url !== AppApis.auth.logout &&
    url !== AppApis.auth.refresh
  ) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null
      })
    }

    const refreshResponse = await refreshPromise

    if (refreshResponse.ok) {
      return await __ClientCall<T>(url, options, false)
    }

    await LogOut()

    throw refreshResponse
  }

  if (!response.ok) {
    throw response
  }

  const data = await response.json()
  return data as T
}
