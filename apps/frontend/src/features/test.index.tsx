"use client"
import { useLocale } from "../hooks";

export default function Test() {
  const { t } = useLocale();
  return <>{t("Common.language")}</>;
}
