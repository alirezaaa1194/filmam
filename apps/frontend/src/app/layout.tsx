import { GetCurrentLocale, GetCurrentUser } from "@/scripts/server";
import "./globals.css";
import Provider from "@/providers/provider.index";
import { GetDir } from "@/scripts";

export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await GetCurrentUser();
  const locale = await GetCurrentLocale(user);

  return (
    <html lang={locale} dir={GetDir(locale)}>
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
