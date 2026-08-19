"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { AppApis } from "../data";
import { type UserType, AppLanguagesEnum, ApiCallOptionsType, CookieOptionsType } from "../types";
import { BuildApiUrl, DefaultLanguage } from ".";
// import { NextRequest, NextResponse } from "next/server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { EN } from "../i18n/en";
import { FA } from "../i18n/fa";
import { AR } from "../i18n/ar";

async function ServerFetch<T>(url: string, options: ApiCallOptionsType, cookieHeader: string, locale: AppLanguagesEnum): Promise<T> {
  const response = await fetch(BuildApiUrl(url, locale, options.query), {
    method: options.method,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "content-type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  return data as T;
}

export async function ServerCall<T>(url: string, options: ApiCallOptionsType): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let locale = options.locale;
  if (!locale) {
    try {
      // const detectedLocale = await getLocale();
      // locale = hasLocale(detectedLocale) ? detectedLocale : undefined;
    } catch {
      // not in a next-intl request context (e.g. route handler)
    }
  }
  locale = locale ?? AppLanguagesEnum.EN;

  return await ServerFetch<T>(url, options, cookieHeader, locale);
}

export const GetCurrentUser = cache(async (locale: AppLanguagesEnum = AppLanguagesEnum.EN): Promise<UserType | null> => {
  try {
    return await ServerCall<UserType>(AppApis.auth.me, { method: "GET", locale });
  } catch {
    return null;
  }
});

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

export async function GetTranslation() {
  const locale = (await GetCookie("locale"))?.value || DefaultLanguage;

  const translations = {
    [AppLanguagesEnum.FA]: FA,
    [AppLanguagesEnum.EN]: EN,
    [AppLanguagesEnum.AR]: AR,
  } as const;

  type NestedKeys<T> = {
    [K in keyof T & string]: T[K] extends Record<string, unknown> ? `${K}.${NestedKeys<T[K]>}` : K;
  }[keyof T & string];

  type TranslationKey = NestedKeys<typeof FA>;

  function getNestedValue<T extends Record<string, unknown>>(object: T, path: string): string {
    let result: unknown = object;

    for (const key of path.split(".")) {
      if (typeof result !== "object" || result === null || !(key in result)) {
        return "";
      }

      result = (result as Record<string, unknown>)[key];
    }

    return typeof result === "string" ? result : "";
  }

  function t(key: TranslationKey): string {
    const language = translations[locale as keyof typeof translations] ?? FA;

    return getNestedValue(language, key);
  }

  return { t };
}

export async function GetCurrentLocale(user: UserType | null) {
  let locale = null;

  if (user) {
    locale = user.preferred_language;
  } else {
    locale = await GetCookie("locale");
  }

  return locale as AppLanguagesEnum;
}

export async function ParseSetCookie(setCookie: string) {
  const parts = setCookie.split(";").map((x) => x.trim());

  const [name, ...valueParts] = parts[0].split("=");

  const value = valueParts.join("=");

  const options: CookieOptionsType = {};

  for (const part of parts.slice(1)) {
    const index = part.indexOf("=");

    if (index === -1) {
      if (part.toLowerCase() === "httponly") options.httpOnly = true;
      if (part.toLowerCase() === "secure") options.secure = true;
      continue;
    }

    const key = part.slice(0, index).trim().toLowerCase();
    const val = part.slice(index + 1).trim();

    switch (key) {
      case "max-age":
        options.maxAge = Number(val);
        break;

      case "expires":
        options.expires = new Date(val);
        break;

      case "path":
        options.path = val;
        break;

      case "domain":
        options.domain = val;
        break;

      case "samesite":
        options.sameSite = val as any;
        break;
    }
  }

  return { name, value, options };
}

// export async function ProxyRefresh(req: NextRequest) {
//   const accessToken = req.cookies.get("accessToken")?.value;

//   if (accessToken) {
//     return NextResponse.next();
//   }

//   const refreshResponse = await fetch(AppApis.auth.refresh, {
//     method: "POST",
//     headers: {
//       Cookie: req.cookies.toString(),
//     },
//     cache: "no-store",
//   });

//   const response = NextResponse.next();

//   if (!refreshResponse.ok) {
//     return response;
//   }

//   const isDevelopment = process.env.NODE_ENV !== "production";

//   for (const setCookie of refreshResponse.headers.getSetCookie()) {
//     const { name, value, options } = await ParseSetCookie(setCookie);

//     if (isDevelopment) {
//       delete options.domain;
//       options.secure = false;
//     }

//     response.cookies.set(name, value, options);
//   }

//   return response;
// }
