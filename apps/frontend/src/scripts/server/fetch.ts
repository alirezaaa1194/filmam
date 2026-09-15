import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { AppApis } from "../../data";
import { AppLanguagesEnum, ApiCallOptionsType, UserType } from "../../types";
import { BuildApiUrl, DefaultLanguage } from "../index";
import { GetLocale } from "./translation";

async function ServerFetch<T>(url: string, options: ApiCallOptionsType, cookieHeader: string | null, locale: AppLanguagesEnum): Promise<T> {
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
  if (!options.ghostMode) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    let locale = options.locale;
    if (!locale) {
      const detectedLocale = await GetLocale();
      locale = detectedLocale || DefaultLanguage;
    }

    return await ServerFetch<T>(url, options, cookieHeader, locale);
  } else {
    let locale = options.locale;
    if (!locale) {
      const detectedLocale = await GetLocale();
      locale = detectedLocale || DefaultLanguage;
    }
    return await ServerFetch<T>(url, options, null, locale);
  }
}

export const GetUser = cache(async (locale: AppLanguagesEnum = AppLanguagesEnum.EN): Promise<UserType | null> => {
  try {
    return await ServerCall<UserType>(AppApis.auth.me, {
      method: "GET",
      locale,
    });
  } catch {
    return null;
  }
});
