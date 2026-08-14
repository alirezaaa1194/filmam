"use client";

import { useState } from "react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { localeCookieName, type Locale } from "@/i18n/config";
import { setClientLocale } from "@/i18n/client-locale";
import { __SetCookie as SetCookie } from "@/scripts/cookies";
import { LocaleContext } from "@/contexts";

import en from "@/i18n/messages/en.json";
import fa from "@/i18n/messages/fa.json";
import ar from "@/i18n/messages/ar.json";

const messages: Record<Locale, AbstractIntlMessages> = { EN: en, FA: fa, AR: ar };

const localeCookieMaxAge = 60 * 60 * 24 * 365;

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
    void SetCookie(localeCookieName, next, localeCookieMaxAge);
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
