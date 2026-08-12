const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7

export function __GetCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue
  }
  return undefined
}

export function __SetCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE
): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`
}

export function __RemoveCookie(name: string): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; path=/; max-age=0`
}

/**
* Remove cookies visible on `document.cookie` for test isolation or cleanup.
*
* - No `filter`: remove every cookie.
* - `string`: remove only names that **start with** that string (prefix).
* - `RegExp`: remove only names where `filter.test(name)` is true.
*/
export function __ClearCookies(filter?: string | RegExp): void {
  if (typeof document === 'undefined') return

  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim()
    if (!name) continue

    const shouldRemove =
      filter === undefined
        ? true
        : typeof filter === 'string'
          ? name.startsWith(filter)
          : filter.test(name)

    if (shouldRemove) {
      __RemoveCookie(name)
    }
  }
}
