import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { getDir } from "@/i18n/config";
import "./globals.css";
import { Api } from "../scripts";
import { AppApis } from "../data";
import { AppLanguagesEnum, UserType } from "../types";
import Provider from "../providers/provider.index";

export const generateMetadata = async () => {
  const t = await getTranslations();
  return {
    title: t("HomePage.title"),
    description: "Watch movies and series",
    icons: { icon: "/logo.svg" },
  };
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  let user: UserType | null = null;
  try {
    user = await Api<UserType>(AppApis.auth.me, { method: "GET", locale });
  } catch {}

  const messages = await getMessages();

  return (
    <html lang={locale} dir={getDir(locale)}>
      <body>
        <Provider user={user} messages={messages} locale={locale}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
