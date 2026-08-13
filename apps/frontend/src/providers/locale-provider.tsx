"use client";

import { createContext, useContext, useState } from "react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/navigation";
import { getDir, localeCookieName, type Locale } from "@/i18n/config";
import { setClientLocale } from "@/i18n/client-locale";
import { __SetCookie as SetCookie } from "@/scripts/cookies";

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
  const router = useRouter();

  function setLocale(next: Locale) {
    if (next === locale) return;

    setLocaleState(next);
    setClientLocale(next);
    SetCookie(localeCookieName, next, localeCookieMaxAge);
    document.documentElement.setAttribute("dir", getDir(next));
    document.documentElement.setAttribute("lang", next.toLowerCase());
    router.refresh();
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export default LocaleProvider;
