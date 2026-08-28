import { GetLocale } from "@/scripts/server/translation";
import "./globals.css";
import Provider from "@/providers/provider.index";
import { GetDir } from "@/scripts";
import { GetUser } from "@/scripts/server/fetch";
import type { Viewport } from "next";
import { ibmPlexSansArabic, inter, iranYekan } from "@/utilities/styles/fonts";

export const instant = false;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00925D",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await GetUser();
  const locale = await GetLocale(user);
  const fontClass = `${inter.variable} ${iranYekan.variable} ${ibmPlexSansArabic.variable}`;

  return (
    <html lang={locale} dir={GetDir(locale)} className={fontClass}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className="bg-black text-white relative font-sans">
        <Provider user={user} locale={locale}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
