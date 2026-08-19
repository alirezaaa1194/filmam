import { AppLanguagesEnum, ApiQueryType } from "../types";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex } from "@noble/hashes/utils";

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

const errorMap: Record<number, string> = {
  400: "errors.bad_request",
  401: "errors.unauthorized",
  403: "errors.forbidden",
  404: "errors.not_found",
  409: "errors.conflict",
  413: "errors.payload_too_large",
  429: "errors.too_many_requests",
  500: "errors.internal_server_error",
};

export function __TranslateServerError(status: number): string {
  return errorMap[status] || "errors.unknown";
}

export function __GetDir(locale: AppLanguagesEnum) {
  const directions = {
    [AppLanguagesEnum.FA]: "rtl",
    [AppLanguagesEnum.AR]: "rtl",
    [AppLanguagesEnum.EN]: "ltr",
  };

  return directions[locale];
}

export const __DefaultLanguage = AppLanguagesEnum.EN;
export const __AppLanguages = [AppLanguagesEnum.EN, AppLanguagesEnum.FA, AppLanguagesEnum.AR];
