import { defaultLocale, type Locale } from "./config";

let currentLocale: Locale = defaultLocale;

export function getClientLocale(): Locale {
  return currentLocale;
}

export function setClientLocale(locale: Locale): void {
  currentLocale = locale;
}
