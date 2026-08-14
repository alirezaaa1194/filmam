import { cookies } from "next/headers";
import { cacheLife } from "next/cache";

import { AppApis } from "../data";
import { buildApiUrl } from "./buildUrl";
import type { UserType } from "../types";
import type { Locale } from "../i18n/config";

/**
 * Server-side user fetch, cached per user/session for 60s.
 *
 * The cookie header is read OUTSIDE the cache scope and passed as an argument,
 * because `use cache` cannot access runtime request APIs (cookies/headers).
 * Since arguments are part of the cache key, every session gets its own
 * private cache entry — users never see each other's data. A locale or
 * language change alters the cookie header, which naturally invalidates the
 * entry and refetches fresh user data.
 */
export async function __GetCurrentUser(locale: Locale): Promise<UserType | null> {
  const store = await cookies();
  const cookieHeader = store.toString();
  return __getCurrentUserCached(locale, cookieHeader);
}

async function __getCurrentUserCached(locale: Locale, cookieHeader: string): Promise<UserType | null> {
  "use cache";
  cacheLife({ revalidate: 60, expire: 3600 });

  try {
    const response = await fetch(buildApiUrl(AppApis.auth.me, locale), {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as UserType;
  } catch {
    return null;
  }
}
