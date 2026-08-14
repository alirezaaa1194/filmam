import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { AppApis } from "../data";
import { ApiQueryType, AppLanguagesEnum } from "../types";
import { hasLocale } from "../i18n/config";
import { __Refresh } from "./refresh";
import { buildApiUrl } from "./buildUrl";

export type ServerCallOptions = {
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  query?: Record<string, unknown> | ApiQueryType;
  locale?: AppLanguagesEnum;
};

function getSetCookieValue(setCookies: string[], name: string): string | null {
  for (const setCookie of setCookies) {
    const match = setCookie.match(new RegExp(`(?:^|,\\s*)${name}=([^;]+)`));
    if (match) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }
  return null;
}

function mergeAccessToken(cookieHeader: string, accessToken: string): string {
  const withoutOldAccessToken = cookieHeader
    .replace(/accessToken=[^;]*;?\s*/g, "")
    .trim();
  return `accessToken=${accessToken}; ${withoutOldAccessToken}`;
}

async function serverFetch<T>(
  url: string,
  options: ServerCallOptions,
  cookieHeader: string,
  locale: AppLanguagesEnum,
): Promise<T> {
  const response = await fetch(buildApiUrl(url, locale, options.query), {
    method: options.method,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "content-type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });

  if (
    response.status === 401 &&
    url !== AppApis.auth.logout &&
    url !== AppApis.auth.refresh
  ) {
    const refreshResponse = await __Refresh(cookieHeader);

    if (refreshResponse.ok) {
      const newAccessToken = getSetCookieValue(
        refreshResponse.headers.getSetCookie(),
        "accessToken",
      );
      if (newAccessToken) {
        return await serverFetch<T>(
          url,
          options,
          mergeAccessToken(cookieHeader, newAccessToken),
          locale,
        );
      }
    }
  }

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  return data as T;
}

/**
 * serverCall — for Server Components / server-side code.
 * Reads the incoming request cookies with Next.js cookies() and forwards them
 * to the backend with a Cookie header. Server-side requests cannot update
 * browser cookies; when the access token is expired, the shared refresh
 * (refresh.ts) is attempted through the /api/auth/refresh route handler and
 * the retried request carries the fresh access token in its Cookie header.
 * The language is read from the active next-intl locale (getLocale), falling
 * back to an explicit option or EN. Callers inside the i18n request config
 * (e.g. getCurrentUser) must pass `locale` explicitly to avoid re-entering
 * the config resolution.
 */
export const __ServerCall = async <T>(
  url: string,
  options: ServerCallOptions,
): Promise<T> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let locale = options.locale;
  if (!locale) {
    try {
      const detectedLocale = await getLocale();
      locale = hasLocale(detectedLocale) ? detectedLocale : undefined;
    } catch {
      // not in a next-intl request context (e.g. route handler)
    }
  }
  locale = locale ?? AppLanguagesEnum.EN;

  return await serverFetch<T>(url, options, cookieHeader, locale);
};