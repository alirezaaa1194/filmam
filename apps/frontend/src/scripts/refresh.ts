const REFRESH_ROUTE = "/api/auth/refresh";

let refreshPromise: Promise<Response> | null = null;

/**
 * Single shared, deduplicated refresh for both clientCall and serverCall.
 * Client side: the browser sends its HttpOnly cookies (credentials: "include")
 * and the route handler writes the rotated cookies back to the browser.
 * Server side: the incoming Cookie header is forwarded so server components
 * can refresh too. Concurrent 401s await the same in-flight refresh.
 */
export function __Refresh(cookieHeader?: string): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = fetch(REFRESH_ROUTE, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}