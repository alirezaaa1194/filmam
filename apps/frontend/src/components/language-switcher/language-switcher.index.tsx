"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { localeCookieName, locales } from "@/i18n/config";

function LanguageSwitcher() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();

  function handleChange(next: string) {
    document.cookie = `${localeCookieName}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <select
      value={locale}
      onChange={(event) => handleChange(event.target.value)}
      aria-label={t("language")}
    >
      {locales.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
