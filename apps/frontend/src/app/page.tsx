import { GetTranslation } from "../scripts/server/translation";
import LayoutProvider from "../providers/layoutProvider";
import Header from "../utilities/components/header/header.index";
import Footer from "../utilities/components/footer/footer.index";
import HomePageComp from "../features/home/home.index";
export async function generateMetadata() {
  const { t } = await GetTranslation();

  return {
    title: t("Layout.title"),
  };
}

export default async function HomePage() {
  return (
    <LayoutProvider header={<Header absolute={true} />} footer={<Footer />}>
      <HomePageComp />
    </LayoutProvider>
  );
}
