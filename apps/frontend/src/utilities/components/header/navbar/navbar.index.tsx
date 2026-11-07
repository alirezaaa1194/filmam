import { MenuItemType } from "@/types";
import NavbarItem from "./navbarItem/navbarItem.index";
import { ServerCall } from "@/scripts/server";
import { AppApis } from "@/data";
import { GetUser } from "@/scripts/server/fetch";
import { GetTranslation } from "@/scripts/server/translation";
import Link from "next/link";
// import { cacheLife, cacheTag } from "next/cache";

async function Navbar() {
  // "use cache"
  // cacheLife('days')
  // cacheTag('menu-data')

  const menuData = await ServerCall<MenuItemType[]>(AppApis.headerMenu.publicAll, { method: "GET", ghostMode: true });
  const user = await GetUser();
  const { t } = await GetTranslation();

  return (
    <div className="hidden lg:flex items-center gap-8">
      {menuData.map((menuItem) => (
        <NavbarItem key={menuItem.id} menuItem={menuItem} />
      ))}
      {!user ? <Link href="/contact" className="flex items-center gap-2 text-body-xs">{t("Header.support")}</Link> : null}
    </div>
  );
}

export default Navbar;
