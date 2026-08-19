const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const AUTH_COOKIE_NAMES = {
  accessToken: ACCESS_TOKEN_COOKIE,
  refreshToken: REFRESH_TOKEN_COOKIE,
} as const;

export function cookieExtractor(name: string) {
  return (request: {
    headers?: Record<string, string | string[] | undefined>;
  }): string | null => {
    const cookieHeader = request?.headers?.cookie;
    if (typeof cookieHeader !== 'string') return null;
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    if (!match) return null;
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  };
}

export function getRequestCookie(
  request: { headers?: Record<string, string | string[] | undefined> },
  name: string,
): string | null {
  return cookieExtractor(name)(request);
}

export function getAccessTokenFromRequest(request): string | null {
  return getRequestCookie(request, ACCESS_TOKEN_COOKIE);
}

export function getRefreshTokenFromRequest(request): string | null {
  return getRequestCookie(request, REFRESH_TOKEN_COOKIE);
}

export function authCookieOptions(maxAgeSeconds: number) {
  // const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    // secure: isProduction,
    // ...(isProduction ? { domain: '.filmamapp.ir' } : {}),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds * 1000,
  };
}
