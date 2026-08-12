"use client";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import LanguageSwitcher from "../components/language-switcher/language-switcher.index";
import { AppLanguagesEnum, UserType } from "../types";

function Provider({ user, messages, locale, children }: { user: UserType | null; messages: AbstractIntlMessages; locale: AppLanguagesEnum; children: React.ReactNode }) {
  console.log(user);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LanguageSwitcher />
      {children}
    </NextIntlClientProvider>
  );
}

export default Provider;
