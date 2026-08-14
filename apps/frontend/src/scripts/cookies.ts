"use server";

import { cookies } from "next/headers";
import { localeCookieName, type Locale } from "../i18n/config";
import { AppApis } from "../data";
import { __ServerCall as ServerCall } from "./serverCall";
import type { UserType } from "../types";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;

const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

const SAFE_NAME = /^[a-zA-Z0-9_-]+$/;

export async function __SetCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE,
): Promise<void> {
  if (!SAFE_NAME.test(name)) return;
  const store = await cookies();
  store.set(name, value, { path: "/", maxAge });
}

export async function __RemoveCookie(name: string): Promise<void> {
  if (!SAFE_NAME.test(name)) return;
  const store = await cookies();
  store.delete(name);
}

/**
 * Remove cookies that start with `prefix`. No prefix removes every cookie.
 */
export async function __ClearCookies(prefix?: string): Promise<void> {
  const store = await cookies();
  const current = store.getAll();
  for (const cookie of current) {
    if (!prefix || cookie.name.startsWith(prefix)) {
      store.delete(cookie.name);
    }
  }
}

/**
 * Change the app locale atomically: persists the locale cookie AND the
 * user's preferred_language in the database inside the same server action.
 * The database write finishes before Next.js re-renders the route, so the
 * re-render resolves the fresh preferred_language instead of a stale one.
 */
export async function __ChangeLocale(user: UserType | null, locale: Locale): Promise<void> {
  const store = await cookies();
  store.set(localeCookieName, locale, { path: "/", maxAge: LOCALE_MAX_AGE });

  if (!user) return;

  try {
    await ServerCall(AppApis.user.updateInfo, {
      method: "PUT",
      body: { ...user, preferred_language: locale },
      locale,
    });
  } catch (error) {
    console.error("Failed to persist preferred_language", error);
  }
}
