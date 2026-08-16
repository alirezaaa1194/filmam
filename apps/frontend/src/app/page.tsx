import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Test from "../features/test.index";
import { useTransition } from "react";

export default async function HomePage() {
  const t = await getTranslations("Layout");



  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <hr />
      <hr />
      <hr />
      <Test />
    </div>
  );
}
