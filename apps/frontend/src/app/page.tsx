import Test from "../features/test.index";
import { GetTranslation } from "../scripts/server";

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
