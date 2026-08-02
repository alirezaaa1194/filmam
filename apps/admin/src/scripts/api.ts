import { GetCookie, LogOut, SetCookie } from '@/scripts'
import { AppApis } from '../data'
import i18n from '../i18n'
import { JWTTokenType } from '../types'

let refreshPromise: Promise<Response> | null = null

async function refreshTokens(): Promise<Response> {
  const refreshToken = GetCookie('refreshToken')
  if (!refreshToken) {
    return new Response(null, { status: 401 })
  }
  const response = await fetch(AppApis.auth.refresh, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  })

  if (response.ok) {
    const refreshResponseData: JWTTokenType = await response.json()
    SetCookie(
      'accessToken',
      refreshResponseData.accessToken,
      refreshResponseData.accessTokenExpiresIn
    )
    SetCookie(
      'refreshToken',
      refreshResponseData.refreshToken,
      refreshResponseData.refreshTokenExpiresIn
    )
  }
  return response
}

export const __Api = async <T>(
  url: string,
  options: { method: 'GET' | 'POST' | 'DELETE' | 'PUT'; body?: unknown },
  retry = true
): Promise<T> => {
  const accessToken = GetCookie('accessToken')
  const refreshToken = GetCookie('refreshToken')

  const currentLanguage = i18n.resolvedLanguage

  const response = await fetch(`${url}?lang=${currentLanguage}`, {
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${url === AppApis.auth.logout ? refreshToken : accessToken}`,
    },
  })

  if (
    response.status === 401 &&
    retry &&
    refreshToken &&
    url !== AppApis.auth.logout
  ) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null
      })
    }

    const refreshResponse = await refreshPromise

    if (refreshResponse.ok) {
      return await __Api<T>(url, options, false)
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
