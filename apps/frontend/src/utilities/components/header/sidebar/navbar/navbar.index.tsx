import { cacheLife, cacheTag } from "next/cache";
import { AppLanguagesEnum, MenuItemType, MenuTypeEnum } from "@/types";
import { ServerCall } from "@/scripts/server";
import { AppApis } from "@/data";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import NavbarItem from "./navbarItem/navbarItem.index";
import { Fragment } from "react/jsx-runtime";

async function Navbar({ locale }: { locale: AppLanguagesEnum }) {
  "use cache";
  cacheLife({ stale: 1800, revalidate: 1800 });
  cacheTag(`menu-data-${locale}`);

  const menuData = await ServerCall<MenuItemType[]>(AppApis.headerMenu.publicAll, { method: "GET", locale, ghostMode: true });

  return menuData.map((menuItem, i) =>
    menuItem.children.length ? (
      <Fragment key={menuItem.id}>
        <NavbarItem menuItem={menuItem} />
        {i + 1 !== menuData.length ? <Separator className="bg-gray-12" /> : null}
      </Fragment>
    ) : (
      <Fragment key={menuItem.id}>
        <Link href={menuItem.menu_type === MenuTypeEnum.PAGE ? `${menuItem.href}` : `/movies${menuItem.filter}`} className={`block py-2 text-body-xs ${i + 1 === menuData.length?'pb-0':''}`}>
          {menuItem.title}
        </Link>
        {i + 1 !== menuData.length ? <Separator className="bg-gray-12" /> : null}
      </Fragment>
    ),
  );
}

export default Navbar;
