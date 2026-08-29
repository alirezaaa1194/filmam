import { AppLanguagesEnum, ApiQueryType, CookieOptionsType } from "../types";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex } from "@noble/hashes/utils";
import { EN } from "../i18n/en";
import { NestedKeys } from "./server";

export function __HashEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return bytesToHex(sha256(new TextEncoder().encode(normalized)));
}

export function __TimerParser(timer: number) {
  const timerMinute = Math.floor(timer / 60);
  const timerSecond = timer % 60;
  return `${timerMinute.toString().padStart(2, "0")}:${timerSecond.toString().padStart(2, "0")}`;
}

export function __BuildApiUrl(url: string, locale: AppLanguagesEnum, query?: Record<string, unknown> | ApiQueryType): string {
  const searchParams = new URLSearchParams({ lang: locale });
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
  }
  return `${url}?${searchParams.toString()}`;
}

type TranslationKey = NestedKeys<typeof EN>;

const errorMap: Record<number, TranslationKey> = {
  400: "errors.bad_request",
  401: "errors.unauthorized",
  403: "errors.forbidden",
  404: "errors.not_found",
  409: "errors.conflict",
  413: "errors.payload_too_large",
  429: "errors.too_many_requests",
  500: "errors.internal_server_error",
};

export function __TranslateServerError(status: number): TranslationKey {
  return errorMap[status] || "errors.unknown";
}

export function __ParseSetCookie(setCookie: string) {
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
        options.sameSite = val as "lax" | "strict" | "none";
        break;
    }
  }

  return { name, value, options };
}

export function __GetDir(locale: AppLanguagesEnum): "ltr" | "rtl" {
  const directions = {
    [AppLanguagesEnum.FA]: "rtl",
    [AppLanguagesEnum.AR]: "rtl",
    [AppLanguagesEnum.EN]: "ltr",
  };

  return directions[locale] as "rtl" | "ltr";
}

const localeYearMap: Record<AppLanguagesEnum, string> = {
  [AppLanguagesEnum.FA]: "fa-IR",
  [AppLanguagesEnum.EN]: "en-US",
  [AppLanguagesEnum.AR]: "ar",
};

export function __GetLocaleYear(locale: AppLanguagesEnum): string {
  return new Intl.DateTimeFormat(localeYearMap[locale], {
    year: "numeric",
  }).format(new Date());
}

export const __DefaultLanguage = AppLanguagesEnum.FA;
export const __AppLanguages = [AppLanguagesEnum.EN, AppLanguagesEnum.FA, AppLanguagesEnum.AR];
