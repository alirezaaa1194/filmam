import { AppLanguagesEnum, MenuItemType } from "@/types";
import NavbarItem from "./navbarItem/navbarItem.index";
import { ServerCall } from "@/scripts/server";
import { AppApis } from "@/data";
import { cacheLife, cacheTag } from "next/cache";

async function Navbar({ locale }: { locale: AppLanguagesEnum }) {
  "use cache";
  cacheLife({ stale: 1800, revalidate: 1800 });
  cacheTag(`menu-data-${locale}`);

  const menuData = await ServerCall<MenuItemType[]>(
    AppApis.headerMenu.publicAll,
    { method: "GET", locale, ghostMode: true },
  );

  return (
    <div className="hidden lg:flex items-center gap-8">
      {menuData.map((menuItem) => (
        <NavbarItem key={menuItem.id} menuItem={menuItem} />
      ))}
    </div>
  );
}

export default Navbar;
