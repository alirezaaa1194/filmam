import { GetTranslation } from "../scripts/server/translation";
import Image from "next/image";
import pic from "@/assets/images/Image.png";
import LayoutProvider from "../providers/layoutProvider";
import Header from "../utilities/components/header/header.index";
import Footer from "../utilities/components/footer/footer.index";
export async function generateMetadata() {
  const { t } = await GetTranslation();

  return {
    title: t("Layout.title"),
  };
}

export default async function HomePage() {
  return (
    <LayoutProvider header={<Header absolute />} footer={<Footer />}>
      <Image src={pic} alt="test" />
    </LayoutProvider>
  );
}
