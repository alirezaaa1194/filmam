"use client";
import { lazy, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { UserContext } from "../contexts";
import { AppLanguagesEnum, UserType } from "../types";
import LocaleProvider from "./localeProvider";
import { SetCookie } from "@/scripts/server/actions";
import { DirectionProvider } from "radix-ui/direction";
import { GetDir } from "../scripts";
import LayoutProvider from "./layoutProvider";
import AuthModalProvider from "./authModalProvider";
import ConfirmModalProvider from "./confirmModalProvider";
import { Toaster } from "../utilities/components/ui";
import { getQueryClient } from "../lib/getQueryClient";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((m) => ({
    default: m.ReactQueryDevtools,
  })),
);

function Provider({ user, locale, children }: { user: UserType | null; locale: AppLanguagesEnum; children: React.ReactNode }) {
  const queryClient = getQueryClient();

  useEffect(() => {
    if (user) {
      SetCookie("locale", user.preferred_language);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext value={user}>
        <LocaleProvider initialLocale={locale}>
          <AuthModalProvider>
            <ConfirmModalProvider>
              <DirectionProvider dir={GetDir(locale)}>
                <LayoutProvider>
                  {children}
                  <Toaster />
                </LayoutProvider>
              </DirectionProvider>
            </ConfirmModalProvider>
          </AuthModalProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </LocaleProvider>
      </UserContext>
    </QueryClientProvider>
  );
}

export default Provider;
