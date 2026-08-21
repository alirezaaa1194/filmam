"use server";

import { cookies } from "next/headers";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;
const SAFE_NAME = /^[a-zA-Z0-9_-]+$/;

export async function SetCookie(name: string, value: string, maxAge: number = DEFAULT_MAX_AGE): Promise<void> {
  if (!SAFE_NAME.test(name)) return;
  const store = await cookies();
  store.set(name, value, { path: "/", maxAge });
}

export async function GetCookie(name: string): Promise<RequestCookie | undefined> {
  if (!SAFE_NAME.test(name)) return;
  const store = await cookies();
  return store.get(name);
}

export async function RemoveCookie(name: string): Promise<void> {
  if (!SAFE_NAME.test(name)) return;
  const store = await cookies();
  store.delete(name);
}

export async function ClearCookies(prefix?: string): Promise<void> {
  const store = await cookies();
  const current = store.getAll();
  for (const cookie of current) {
    if (!prefix || cookie.name.startsWith(prefix)) {
      store.delete(cookie.name);
    }
  }
}
