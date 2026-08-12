import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, hasLocale, localeCookieName } from "./config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieValue = store.get(localeCookieName)?.value;

  const locale = hasLocale(cookieValue) ? cookieValue : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale.toLowerCase()}.json`)).default,
  };
});
