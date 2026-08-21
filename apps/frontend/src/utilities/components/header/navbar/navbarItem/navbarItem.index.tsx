import { MenuItemType, MenuTypeEnum } from "@/types";
import { ArrowDown2 } from "iconsax-react";
import Link from "next/link";

function NavbarItem({ menuItem }: { menuItem: MenuItemType }) {
  return (
    <div className="relative group">
      <Link href={menuItem.menu_type === MenuTypeEnum.PAGE ? `${menuItem.href}` : `/movies${menuItem.filter}`} className="flex items-center gap-2 text-body-xs">
        {menuItem.title} {menuItem.children.length ? <ArrowDown2 color="white" size={20} className="group-hover:rotate-180 transition-all" /> : null}
      </Link>
      {menuItem.children.length ? (
        <div className="py-6 absolute opacity-0 invisible transition-all delay-[.001ms] group-hover:opacity-100 group-hover:visible">
          <div className="w-[184px] bg-gray-13 rounded-lg border border-gray-12 p-3 grid grid-cols-2">
            {menuItem.children.map((menuItemChild) => (
              <Link key={menuItemChild.id} href={menuItemChild.menu_type === MenuTypeEnum.PAGE ? `${menuItemChild.href}` : `/movies${menuItemChild.filter}`} className="col-span-1 hover:bg-gray-11 block py-1 px-2 rounded-sm transition-all delay-[.001ms] text-body-xxs truncate">
                {menuItemChild.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NavbarItem;
