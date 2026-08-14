import { getLocale, getTranslations } from "next-intl/server";
import { getDir } from "@/i18n/config";
import "./globals.css";
import Provider from "../providers/provider.index";
import { getCurrentUser } from "../scripts/server";

export const instant = false;

export const generateMetadata = async () => {
  const t = await getTranslations("Layout");
  return {
    title: t("title"),
    description: t("description"),
    icons: { icon: "/logo.svg" },
  };
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const user = await getCurrentUser(locale);

  return (
    <html lang={locale} dir={getDir(locale)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#00925D" />
      </head>
      <body>
        <Provider user={user} locale={locale}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
