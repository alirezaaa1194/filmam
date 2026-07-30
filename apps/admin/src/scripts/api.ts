import { GetCookie, LogOut, SetCookie } from '@/scripts'
import { AppApis } from '../data'
import i18n from '../i18n'
import { JWTTokenType } from '../types'

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

  if (response.status === 401 && retry && refreshToken) {
    const refreshResponse = await fetch(AppApis.auth.refresh, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    if (refreshResponse.ok) {
      const refreshResponseData: JWTTokenType = await refreshResponse.json()
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
      return __Api<T>(url, options, false)
    }

    LogOut()

    const error = await refreshResponse.json()
    throw error
  }

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data as T
}
