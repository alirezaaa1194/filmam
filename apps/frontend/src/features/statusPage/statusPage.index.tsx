"use client";

import Link from "next/link";
import { ShieldTick } from "iconsax-react";
import { useLocale } from "@/hooks";
import { Button } from "@/utilities/components/ui/button/button.index";

export default function StatusPageComp({ type, onRetry }: { type: "notFound" | "error"; onRetry?: () => void }) {
  const { dir, t } = useLocale();
  const isNotFound = type === "notFound";
  const titleKey = isNotFound ? "errors.pageNotFoundTitle" : "errors.pageErrorTitle";
  const descriptionKey = isNotFound ? "errors.pageNotFoundDescription" : "errors.pageErrorDescription";

  return (
    <>
      <title>{`${t(titleKey)} | ${t("Common.filmam")}`}</title>
      <meta name="description" content={t(descriptionKey)} />
    <main dir={dir} className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-layout-max items-center justify-center px-layout-x-space pt-[104px] lg:pt-[152px]">
      <section className="flex w-full max-w-lg flex-col items-center rounded-2xl border border-gray-11 bg-gray-13 px-6 py-10 text-center sm:px-10 sm:py-12">
        <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10"><ShieldTick className="size-8 stroke-primary" /></span>
        <h1 className="mb-3 text-h-5 font-bold text-white">{t(titleKey)}</h1>
        <p className="mb-7 text-body-xxs leading-7 text-gray-7">{t(descriptionKey)}</p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {onRetry ? <Button onClick={onRetry} className="h-11 cursor-pointer rounded-md px-8 text-button-s">{t("errors.tryAgain")}</Button> : null}
          <Button asChild variant={onRetry ? "outline" : "default"} className="h-11 rounded-md border-gray-10 px-8 text-button-s text-white">
            <Link href="/">{t("errors.goHome")}</Link>
          </Button>
        </div>
      </section>
    </main>
    </>
  );
}
