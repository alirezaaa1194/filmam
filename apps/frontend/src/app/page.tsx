import { Metadata } from "next";
import Test from "../features/test.index";
import { GetTranslation } from "../scripts/server";

export async function generateMetadata() {
  const { t } = await GetTranslation();

  return {
    title: t("Layout.title"),
  };
}

export default async function HomePage() {
  const { t } = await GetTranslation();

  return (
    <div>
      {t("Layout.description")}
      <br />
      <Test />
    </div>
  );
}
