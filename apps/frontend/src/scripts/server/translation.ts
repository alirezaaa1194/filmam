import "server-only";
import { cookies } from "next/headers";
import { AppLanguagesEnum, UserType } from "../../types";
import { DefaultLanguage } from "../index";
import { FA } from "../../i18n/fa";
import { EN } from "../../i18n/en";
import { AR } from "../../i18n/ar";

export type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? `${K}.${NestedKeys<T[K]>}` : K;
}[keyof T & string];

export type TranslationKey = NestedKeys<typeof EN>;

export async function GetTranslation() {
  const locale = (await cookies()).get("locale")?.value || DefaultLanguage;

  const translations = {
    [AppLanguagesEnum.FA]: FA,
    [AppLanguagesEnum.EN]: EN,
    [AppLanguagesEnum.AR]: AR,
  } as const;

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

export async function GetLocale(user: UserType | null): Promise<AppLanguagesEnum> {
  let locale = null;

  if (user) {
    locale = user.preferred_language;
  } else {
    locale = (await cookies()).get("locale")?.value;
  }

  return locale as AppLanguagesEnum;
}
