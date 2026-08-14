"use server";

import { cookies } from "next/headers";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;

const SAFE_NAME = /^[a-zA-Z0-9_-]+$/;

export async function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE,
): Promise<void> {
  if (!SAFE_NAME.test(name)) return;
  const store = await cookies();
  store.set(name, value, { path: "/", maxAge });
}

export async function removeCookie(name: string): Promise<void> {
  if (!SAFE_NAME.test(name)) return;
  const store = await cookies();
  store.delete(name);
}

/**
 * Remove cookies that start with `prefix`. No prefix removes every cookie.
 */
export async function clearCookies(prefix?: string): Promise<void> {
  const store = await cookies();
  const current = store.getAll();
  for (const cookie of current) {
    if (!prefix || cookie.name.startsWith(prefix)) {
      store.delete(cookie.name);
    }
  }
}
