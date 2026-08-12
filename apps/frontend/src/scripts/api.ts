import { GetCookie, LogOut, SetCookie } from "@/scripts";
import { AppApis } from "../data";
import { ApiQueryType, AppLanguagesEnum, JWTTokenType } from "../types";

const localeCookieName = "locale";

function resolveApiLanguage(): AppLanguagesEnum {
  const cookieValue = GetCookie(localeCookieName)?.toUpperCase();
  if (cookieValue === AppLanguagesEnum.FA || cookieValue === AppLanguagesEnum.AR || cookieValue === AppLanguagesEnum.EN) {
    return cookieValue;
  }
  return AppLanguagesEnum.EN;
}

let refreshPromise: Promise<Response> | null = null;

async function refreshTokens(): Promise<Response> {
  const refreshToken = GetCookie("refreshToken");
  if (!refreshToken) {
    return new Response(null, { status: 401 });
  }
  const response = await fetch(AppApis.auth.refresh, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (response.ok) {
    const refreshResponseData: JWTTokenType = await response.json();
    SetCookie("accessToken", refreshResponseData.accessToken, refreshResponseData.accessTokenExpiresIn);
    SetCookie("refreshToken", refreshResponseData.refreshToken, refreshResponseData.refreshTokenExpiresIn);
  }
  return response;
}

export const __Api = async <T>(
  url: string,
  options: {
    method: "GET" | "POST" | "DELETE" | "PUT";
    body?: unknown;
    query?: Record<string, unknown> | ApiQueryType;
    locale: AppLanguagesEnum;
  },
  retry = true,
): Promise<T> => {
  const accessToken = GetCookie("accessToken");
  const refreshToken = GetCookie("refreshToken");

  const currentLanguage = options.locale ?? resolveApiLanguage();
  let queryString = "";

  if (options.query) {
    const queryParams = new URLSearchParams();
    for (const key in options.query) {
      const value = options.query[key as keyof ApiQueryType];
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    }
    queryString = `&${queryParams.toString()}`;
  }
  const response = await fetch(`${url}?lang=${currentLanguage}${queryString}`, {
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${url === AppApis.auth.logout ? refreshToken : accessToken}`,
    },
  });

  if (response.status === 401 && retry && refreshToken && url !== AppApis.auth.logout) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshResponse = await refreshPromise;

    if (refreshResponse.ok) {
      return await __Api<T>(url, options, false);
    }

    await LogOut();

    throw refreshResponse;
  }

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  return data as T;
};
