import { MenuItemType } from "@/types";
import NavbarItem from "./navbarItem/navbarItem.index";
import { ServerCall } from "@/scripts/server";
import { AppApis } from "@/data";
// import { cacheLife, cacheTag } from "next/cache";

async function Navbar() {
  // "use cache"
  // cacheLife('days')
  // cacheTag('menu-data')

  const menuData = await ServerCall<MenuItemType[]>(AppApis.headerMenu.publicAll, { method: "GET", ghostMode: true });

  return (
    <div className="hidden lg:flex items-center gap-8">
      {menuData.map((menuItem) => (
        <NavbarItem key={menuItem.id} menuItem={menuItem} />
      ))}
    </div>
  );
}

export default Navbar;
