"use client";

import { useTranslations } from "next-intl";

export default function Test() {
  const t = useTranslations("Layout");
  return (
    <>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </>
  );
}
