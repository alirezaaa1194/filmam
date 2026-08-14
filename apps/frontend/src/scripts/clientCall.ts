import { getClientLocale } from "../i18n/client-locale";
import { AppApis } from "../data";
import { ApiQueryType, AppLanguagesEnum } from "../types";
import { __Refresh } from "./refresh";
import { buildApiUrl } from "./buildUrl";

const LOGOUT_ROUTE = "/api/auth/logout";

export type ClientCallOptions = {
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
  query?: Record<string, unknown> | ApiQueryType;
  locale?: AppLanguagesEnum;
};

async function clientLogout(): Promise<void> {
  try {
    await fetch(LOGOUT_ROUTE, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // cookies are cleared best-effort; nothing else to do
  }
}

/**
 * clientCall — for Client Components.
 * Uses credentials: "include" so the browser automatically sends the HttpOnly
 * authentication cookies. Never reads accessToken/refreshToken from JS.
 * The language is read from the active next-intl locale (client store).
 */
export const __ClientCall = async <T>(
  url: string,
  options: ClientCallOptions,
  retry = true,
): Promise<T> => {
  const currentLanguage = options.locale ?? getClientLocale();

  const response = await fetch(buildApiUrl(url, currentLanguage, options.query), {
    method: options.method,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "content-type": "application/json",
    },
  });

  if (
    response.status === 401 &&
    retry &&
    url !== AppApis.auth.logout &&
    url !== AppApis.auth.refresh
  ) {
    const refreshResponse = await __Refresh();

    if (refreshResponse.ok) {
      return await __ClientCall<T>(url, options, false);
    }

    await clientLogout();

    throw refreshResponse;
  }

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  return data as T;
};