import { AppLanguagesEnum } from "../types";

export const locales = [AppLanguagesEnum.EN, AppLanguagesEnum.FA, AppLanguagesEnum.AR];

export type Locale = AppLanguagesEnum;

export const defaultLocale: Locale = AppLanguagesEnum.EN;

export const localeCookieName = "locale";

const dirMap: Record<Locale, "ltr" | "rtl"> = {
  FA: "rtl",
  AR: "rtl",
  EN: "ltr",
};

export function getDir(locale: Locale): "ltr" | "rtl" {
  return dirMap[locale];
}

export function hasLocale(locale: string | undefined | null): locale is Locale {
  return locale != null && (locales as readonly string[]).includes(locale);
}
