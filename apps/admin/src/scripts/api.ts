import { GetCookie } from '@/scripts'
import { AppApis } from '../data'

export const __Api = async <T>(
  url: string,
  options: { method: string; body?: unknown },
  retry = true
): Promise<T> => {
  const accessToken = GetCookie('accessToken')
  const refreshToken = GetCookie('refreshToken')

  const response = await fetch(url, {
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
      // save new token
      return __Api<T>(url, options, false)
    }

    const error = await refreshResponse.json()
    throw error
  }

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data as T
}
