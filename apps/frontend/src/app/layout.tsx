import { GetLocale } from "@/scripts/server/translation";
import "./globals.css";
import Provider from "@/providers/provider.index";
import { GetDir } from "@/scripts";
import { GetUser } from "@/scripts/server/fetch";
import type { Metadata, Viewport } from "next";
import { ibmPlexSansArabic, inter, iranYekan } from "@/utilities/styles/fonts";
import { AppLanguagesEnum } from "@/types";

export const instant = false;

export const metadata: Metadata = {
  icons: {
    icon: "/icons/filmam-pwa.svg",
    apple: "/icons/filmam-pwa.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0c0c0c",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await GetUser();
  const locale = await GetLocale(user);
  const fontClass = `${inter.variable} ${iranYekan.variable} ${ibmPlexSansArabic.variable}`;
  const pwaTitle = {
    [AppLanguagesEnum.FA]: "فیلمام",
    [AppLanguagesEnum.EN]: "Filmam",
    [AppLanguagesEnum.AR]: "فيلمام",
  }[locale] ?? "Filmam";

  return (
    <html lang={locale} dir={GetDir(locale)} className={fontClass}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="application-name" content={pwaTitle} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={pwaTitle} />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-black text-white relative font-sans">
        <Provider user={user} locale={locale}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
