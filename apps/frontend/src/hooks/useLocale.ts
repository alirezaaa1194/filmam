"use client"
import { use } from "react";
import { LocaleContext } from "../contexts";
import { AppLanguagesEnum } from "../types";
import { FA } from "@/i18n/fa";
import { EN } from "../i18n/en";
import { AR } from "../i18n/ar";

const translations = {
  [AppLanguagesEnum.FA]: FA,
  [AppLanguagesEnum.EN]: EN,
  [AppLanguagesEnum.AR]: AR,
} as const;

type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? `${K}.${NestedKeys<T[K]>}` : K;
}[keyof T & string];

function getNestedValue(object: Record<string, any>, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], object);
}

export function __UseLocale() {
  const { locale, setLocale } = use(LocaleContext);

  function t(key: NestedKeys<typeof EN>) {
    return getNestedValue(translations[locale], key);
  }

  return { locale, setLocale, t };
}
