import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, hasLocale, localeCookieName } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const store = await cookies();
  const cookieValue = store.get(localeCookieName)?.value;
  const browserLocale = await requestLocale;

  const locale = hasLocale(cookieValue)
    ? cookieValue
    : hasLocale(browserLocale)
      ? browserLocale
      : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale.toLowerCase()}.json`)).default,
  };
});
