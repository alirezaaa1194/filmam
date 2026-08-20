import { GetLocale } from "@/scripts/server/translation";
import "./globals.css";
import Provider from "@/providers/provider.index";
import Header from "@/utilities/components/header/header.index";
import { GetDir } from "@/scripts";
import { GetUser } from "@/scripts/server/fetch";

export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await GetUser();
  const locale = await GetLocale(user);

  return (
    <html lang={locale} dir={GetDir(locale)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#00925D" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className="bg-black text-white max-w-layout-max mx-auto relative">
        <Provider user={user} locale={locale}>
          <Header absolute />
          {children}
        </Provider>
      </body>
    </html>
  );
}
