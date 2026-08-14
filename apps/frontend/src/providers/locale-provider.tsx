"use client";

import { createContext, useContext, useState } from "react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { getDir, localeCookieName, type Locale } from "@/i18n/config";
import { setClientLocale } from "@/i18n/client-locale";
import { setCookie } from "@/app/actions/cookies";

import en from "@/i18n/messages/en.json";
import fa from "@/i18n/messages/fa.json";
import ar from "@/i18n/messages/ar.json";

const messages: Record<Locale, AbstractIntlMessages> = { EN: en, FA: fa, AR: ar };

const localeCookieMaxAge = 60 * 60 * 24 * 365;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleContext(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return context;
}

function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState(() => {
    setClientLocale(initialLocale);
    return initialLocale;
  });

  function setLocale(next: Locale) {
    if (next === locale) return;

    setLocaleState(next);
    setClientLocale(next);
    document.documentElement.setAttribute("dir", getDir(next));
    document.documentElement.setAttribute("lang", next.toLowerCase());

    void setCookie(localeCookieName, next, localeCookieMaxAge);
  }

  return (
    <LocaleContext value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext>
  );
}

export default LocaleProvider;
