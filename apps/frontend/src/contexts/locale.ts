"use client";
import { createContext } from "react";
import { DefaultLanguage } from "../scripts";
import { AppLanguagesEnum } from "../types";

export const LocaleContext = createContext({
  locale: DefaultLanguage,
  setLocale: (locale: AppLanguagesEnum) => {},
});
