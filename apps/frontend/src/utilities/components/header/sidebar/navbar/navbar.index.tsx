import { MenuItemType, MenuTypeEnum } from "@/types";
import { ServerCall } from "@/scripts/server";
import { AppApis } from "@/data";
import { Separator } from "@/utilities/components/ui/separator/separator.index";
import Link from "next/link";
import NavbarItem from "./navbarItem/navbarItem.index";
import { Fragment } from "react/jsx-runtime";
import { GetUser } from "@/scripts/server/fetch";
import { GetTranslation } from "@/scripts/server/translation";

async function Navbar() {
  const menuData = await ServerCall<MenuItemType[]>(AppApis.headerMenu.publicAll, { method: "GET", ghostMode: true });
  const user = await GetUser();
  const { t } = await GetTranslation();

  return (
    <>
      {menuData.map((menuItem, i) =>
        menuItem.children.length ? (
          <Fragment key={menuItem.id}>
            <NavbarItem menuItem={menuItem} />
            {i + 1 !== menuData.length ? <Separator className="bg-gray-12" /> : null}
          </Fragment>
        ) : (
          <Fragment key={menuItem.id}>
            <Link href={menuItem.menu_type === MenuTypeEnum.PAGE ? `${menuItem.href}` : `/movies${menuItem.filter}`} className={`block py-2 text-body-xs ${i + 1 === menuData.length ? "pb-0" : ""}`}>
              {menuItem.title}
            </Link>
            {i + 1 !== menuData.length ? <Separator className="bg-gray-12" /> : null}
          </Fragment>
        ),
      )}
      {!user && menuData.length ? <Separator className="bg-gray-12" /> : null}
      {!user ? <Link href="/contact" className="block py-2 text-body-xs">{t("Header.support")}</Link> : null}
    </>
  );
}

export default Navbar;
