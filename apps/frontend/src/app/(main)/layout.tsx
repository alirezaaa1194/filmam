import Footer from "../../utilities/components/footer/footer.index";
import Header from "../../utilities/components/header/header.index";

export const instant = false;

export default async function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header absolute />
      {children}
      <Footer />
    </>
  );
}
