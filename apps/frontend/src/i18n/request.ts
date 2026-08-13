import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, hasLocale, localeCookieName } from "./config";
import { getCurrentUser } from "../scripts";

export default getRequestConfig(async ({ requestLocale }) => {
  const store = await cookies();
  const cookieValue = store.get(localeCookieName)?.value;
  const browserLocale = await requestLocale;

  let locale = hasLocale(cookieValue)
    ? cookieValue
    : hasLocale(browserLocale)
      ? browserLocale
      : defaultLocale;

  const user = await getCurrentUser(locale);

  if (!hasLocale(cookieValue) && user && hasLocale(user.preferred_language)) {
    locale = user.preferred_language;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale.toLowerCase()}.json`)).default,
  };
});
