import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, hasLocale, localeCookieName, type Locale } from "./config";
import { getCurrentUser } from "../scripts/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const store = await cookies();
  const cookieValue = store.get(localeCookieName)?.value;
  const browserLocale = await requestLocale;

  const user = await getCurrentUser(defaultLocale);

  let locale: Locale | null = user && hasLocale(user.preferred_language) ? user.preferred_language : null;

  if (!locale) {
    locale = hasLocale(cookieValue) ? cookieValue : null;
  }

  locale = locale ?? (hasLocale(browserLocale) ? browserLocale : defaultLocale);

  return {
    locale,
    messages: (await import(`./messages/${locale.toLowerCase()}.json`)).default,
  };
});
