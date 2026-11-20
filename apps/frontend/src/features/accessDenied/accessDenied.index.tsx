"use client";

import { use } from "react";
import Link from "next/link";
import { ShieldTick } from "iconsax-react";
import { AuthModalContext } from "@/contexts/authModal";
import { useLocale } from "@/hooks";
import { AuthModeEnum } from "@/types";
import { Button } from "@/utilities/components/ui/button/button.index";
import { RedirectToProfile } from "@/scripts/server/actions";

export default function AccessDeniedComp() {
  const { setAuthMode } = use(AuthModalContext);
  const { dir, t } = useLocale();

  return (
    <main dir={dir} className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-layout-max items-center justify-center px-layout-x-space pt-[104px] lg:pt-[152px]">
      <section className="flex w-full max-w-lg flex-col items-center rounded-2xl border border-gray-11 bg-gray-13 px-6 py-10 text-center sm:px-10 sm:py-12">
        <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10"><ShieldTick className="size-8 stroke-primary" /></span>
        <h1 className="mb-3 text-h-5 font-bold text-white">{t("UserPanel.accessTitle")}</h1>
        <p className="mb-7 text-body-xxs leading-7 text-gray-7">{t("UserPanel.accessDescription")}</p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button onClick={() => setAuthMode({ mode: AuthModeEnum.LOGIN, callback: RedirectToProfile })} className="h-11 cursor-pointer rounded-md px-8 text-button-s">{t("UserPanel.login")}</Button>
          <Button asChild variant="outline" className="h-11 rounded-md border-gray-10 px-8 text-button-s text-white">
            <Link href="/">{t("Common.viewAll")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
