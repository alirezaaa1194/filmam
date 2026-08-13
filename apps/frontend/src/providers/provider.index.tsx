"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LanguageSwitcher from "../components/language-switcher/language-switcher.index";
import { UserContext } from "../contexts";
import { AppLanguagesEnum, UserType } from "../types";
import LocaleProvider from "./locale-provider";

function Provider({
  user,
  locale,
  children,
}: {
  user: UserType | null;
  locale: AppLanguagesEnum;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext value={user}>
        <LocaleProvider initialLocale={locale}>
          <LanguageSwitcher />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </LocaleProvider>
      </UserContext>
    </QueryClientProvider>
  );
}

export default Provider;
