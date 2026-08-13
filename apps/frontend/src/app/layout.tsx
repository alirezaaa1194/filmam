import { getLocale, getTranslations } from "next-intl/server";
import { getDir } from "@/i18n/config";
import "./globals.css";
import Provider from "../providers/provider.index";
import { getCurrentUser } from "../scripts";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const instant = false;

export const generateMetadata = async () => {
  const t = await getTranslations();
  return {
    title: t("HomePage.title"),
    description: t("HomePage.description"),
    icons: { icon: "/logo.svg" },
  };
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const user = await getCurrentUser(locale);

  return (
    <html lang={locale} dir={getDir(locale)} className={cn("font-sans", geist.variable)}>
      <body>
        <Provider user={user} locale={locale}>
          {children}
        </Provider>
      </body>
    </html>
  );
}